const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

// Helper: Calculate booking amount
const calculateBookingAmount = (pricing, durationType, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  let pricePerUnit, totalAmount;

  if (durationType === "monthly") {
    const months = Math.ceil(totalDays / 30);
    pricePerUnit = pricing.monthly;
    totalAmount = months * pricing.monthly;
  } else if (durationType === "weekly") {
    const weeks = Math.ceil(totalDays / 7);
    pricePerUnit = pricing.weekly;
    totalAmount = weeks * pricing.weekly;
  } else {
    pricePerUnit = pricing.daily;
    totalAmount = totalDays * pricing.daily;
  }

  return { totalDays, pricePerUnit, totalAmount };
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Customer
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, durationType, startDate, endDate, customerNotes } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    if (vehicle.listingStatus !== "approved") {
      return ApiResponse.badRequest(res, "This vehicle is not available for booking");
    }

    if (vehicle.status !== "available") {
      return ApiResponse.badRequest(
        res,
        `Vehicle is currently ${vehicle.status}. Please choose another vehicle`
      );
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ["pending", "approved", "active"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlapping) {
      return ApiResponse.badRequest(
        res,
        "Vehicle is already booked for the selected dates. Please choose different dates"
      );
    }

    const { totalDays, pricePerUnit, totalAmount } = calculateBookingAmount(
      vehicle.pricing,
      durationType,
      startDate,
      endDate
    );

    const booking = await Booking.create({
      customer: req.user._id,
      vehicle: vehicleId,
      owner: vehicle.owner,
      location: vehicle.location,
      durationType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalDays,
      pricePerUnit,
      totalAmount,
      customerNotes,
      status: "pending",
    });

    await booking.populate([
      { path: "vehicle", select: "brand model vehicleNumber images type pricing" },
      { path: "owner", select: "name phone businessName" },
      { path: "location", select: "name city" },
    ]);

    return ApiResponse.created(
      res,
      "Booking request sent successfully! Waiting for owner approval 🎉",
      { booking }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/my-bookings
// @access  Customer
const getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { customer: req.user._id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const bookings = await Booking.find(query)
      .populate("vehicle", "brand model vehicleNumber images type")
      .populate("owner", "name phone businessName")
      .populate("location", "name city")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "Your bookings fetched successfully",
      bookings,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Customer / Owner / Admin
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("vehicle", "brand model vehicleNumber images type pricing color")
      .populate("customer", "name email phone")
      .populate("owner", "name phone businessName")
      .populate("location", "name city state address");

    if (!booking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    const userId = req.user._id.toString();
    const isCustomer = booking.customer._id.toString() === userId;
    const isOwner = booking.owner._id.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isOwner && !isAdmin) {
      return ApiResponse.forbidden(res, "Not authorized to view this booking");
    }

    return ApiResponse.success(res, "Booking fetched successfully", { booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Owner)
// @route   PUT /api/bookings/:id/status
// @access  Owner / Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, cancellationReason, ownerNotes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    const isOwner =
      booking.owner.toString() === req.user._id.toString() &&
      req.user.role === "owner";
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return ApiResponse.forbidden(res, "Not authorized to update this booking");
    }

    // ✅ FIXED: Status transition validation includes "active"
    const validTransitions = {
      pending: ["approved", "rejected"],
      approved: ["active", "cancelled"],
      active: ["completed", "cancelled"],
    };

    if (
      !validTransitions[booking.status] ||
      !validTransitions[booking.status].includes(status)
    ) {
      return ApiResponse.badRequest(
        res,
        `Cannot change booking status from '${booking.status}' to '${status}'`
      );
    }

    // Update booking
    booking.status = status;
    if (ownerNotes) booking.ownerNotes = ownerNotes;

    if (status === "approved") {
      booking.approvedAt = new Date();
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "booked" });
    }

    if (status === "rejected") {
      if (!rejectionReason) {
        return ApiResponse.badRequest(res, "Rejection reason is required");
      }
      booking.rejectionReason = rejectionReason;
    }

    if (status === "active") {
      // Vehicle status already "booked" from approval
      // Nothing else to do
    }

    if (status === "completed") {
      booking.completedAt = new Date();
      // ✅ FIXED: Update both vehicle status AND stats in one operation
      await Vehicle.findByIdAndUpdate(booking.vehicle, {
        status: "available",
        $inc: {
          totalBookings: 1,
          totalRevenue: booking.totalAmount,
        },
      });
      await User.findByIdAndUpdate(booking.customer, {
        $inc: { totalBookings: 1 },
      });
    }

    if (status === "cancelled") {
      booking.cancellationReason = cancellationReason || "Cancelled";
      booking.cancelledBy = isAdmin ? "admin" : "owner";
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "available" });
    }

    await booking.save();

    await booking.populate([
      { path: "vehicle", select: "brand model vehicleNumber" },
      { path: "customer", select: "name email phone" },
    ]);

    return ApiResponse.success(res, `Booking ${status} successfully`, { booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Customer
const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return ApiResponse.notFound(res, "Booking not found");
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return ApiResponse.forbidden(res, "Not authorized to cancel this booking");
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return ApiResponse.badRequest(
        res,
        `Cannot cancel booking with status '${booking.status}'`
      );
    }

    const wasApproved = booking.status === "approved";

    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason || "Cancelled by customer";
    booking.cancelledBy = "customer";

    // Free up vehicle if was approved
    if (wasApproved) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "available" });
    }

    await booking.save();

    return ApiResponse.success(res, "Booking cancelled successfully", { booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner bookings
// @route   GET /api/bookings/owner-bookings
// @access  Owner
const getOwnerBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { owner: req.user._id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const bookings = await Booking.find(query)
      .populate("vehicle", "brand model vehicleNumber images type")
      .populate("customer", "name email phone")
      .populate("location", "name city")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "Owner bookings fetched successfully",
      bookings,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Admin
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const bookings = await Booking.find(query)
      .populate("vehicle", "brand model vehicleNumber type")
      .populate("customer", "name email phone")
      .populate("owner", "name email businessName")
      .populate("location", "name city")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "All bookings fetched successfully",
      bookings,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Check vehicle availability
// @route   POST /api/bookings/check-availability
// @access  Logged In Users
const checkAvailability = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return ApiResponse.badRequest(
        res,
        "vehicleId, startDate and endDate are required"
      );
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ["pending", "approved", "active"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    return ApiResponse.success(res, "Availability checked", {
      isAvailable: !overlapping,
      vehicle: {
        id: vehicle._id,
        name: `${vehicle.brand} ${vehicle.model}`,
        status: vehicle.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getOwnerBookings,
  getAllBookingsAdmin,
  checkAvailability,
};