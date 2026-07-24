const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Location = require("../models/Location");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOwners = await User.countDocuments({ role: "owner" });

    // Vehicle stats
    const totalVehicles = await Vehicle.countDocuments({
      listingStatus: "approved",
    });
    const pendingListings = await Vehicle.countDocuments({
      listingStatus: "pending",
    });
    const availableVehicles = await Vehicle.countDocuments({
      listingStatus: "approved",
      status: "available",
    });

    // Booking stats
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });
    const activeBookings = await Booking.countDocuments({
      status: "active",
    });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    // Revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgBookingValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const avgBookingValue = revenueData[0]?.avgBookingValue || 0;

    // This month stats
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate("vehicle", "brand model vehicleNumber type")
      .populate("customer", "name email")
      .populate("owner", "name businessName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .limit(5);

    // Pending vehicle approvals
    const pendingVehicles = await Vehicle.find({ listingStatus: "pending" })
      .populate("owner", "name businessName phone")
      .populate("location", "name city")
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(res, "Dashboard stats fetched successfully", {
      stats: {
        users: {
          total: totalUsers,
          owners: totalOwners,
          newThisMonth: newUsersThisMonth,
        },
        vehicles: {
          total: totalVehicles,
          pending: pendingListings,
          available: availableVehicles,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          active: activeBookings,
          completed: completedBookings,
          thisMonth: monthlyBookings,
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthlyRevenue[0]?.total || 0,
          avgBookingValue: Math.round(avgBookingValue),
        },
      },
      recentBookings,
      recentUsers,
      pendingVehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject vehicle listing
// @route   PUT /api/admin/vehicles/:id/listing-status
// @access  Admin
const updateVehicleListingStatus = async (req, res, next) => {
  try {
    const { listingStatus, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(listingStatus)) {
      return ApiResponse.badRequest(
        res,
        "listingStatus must be approved or rejected"
      );
    }

    if (listingStatus === "rejected" && !rejectionReason) {
      return ApiResponse.badRequest(
        res,
        "Rejection reason is required when rejecting a listing"
      );
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    vehicle.listingStatus = listingStatus;
    if (listingStatus === "approved") {
      vehicle.status = "available";
      vehicle.rejectionReason = null;
    } else {
      vehicle.status = "inactive";
      vehicle.rejectionReason = rejectionReason;
    }

    await vehicle.save();

    await vehicle.populate([
      { path: "owner", select: "name email businessName" },
      { path: "location", select: "name city" },
    ]);

    return ApiResponse.success(
      res,
      `Vehicle listing ${listingStatus} successfully`,
      { vehicle }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending vehicle listings
// @route   GET /api/admin/vehicles/pending
// @access  Admin
const getPendingListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { listingStatus: "pending" };
    const total = await Vehicle.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const vehicles = await Vehicle.find(query)
      .populate("owner", "name email phone businessName")
      .populate("location", "name city state")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "Pending listings fetched successfully",
      vehicles,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Manage pricing categories
// @route   GET /api/admin/pricing
// @access  Admin
const getPricingOverview = async (req, res, next) => {
  try {
    const pricingStats = await Vehicle.aggregate([
      { $match: { listingStatus: "approved" } },
      {
        $group: {
          _id: "$type",
          avgDailyPrice: { $avg: "$pricing.daily" },
          avgWeeklyPrice: { $avg: "$pricing.weekly" },
          avgMonthlyPrice: { $avg: "$pricing.monthly" },
          minDailyPrice: { $min: "$pricing.daily" },
          maxDailyPrice: { $max: "$pricing.daily" },
          totalVehicles: { $sum: 1 },
        },
      },
    ]);

    return ApiResponse.success(
      res,
      "Pricing overview fetched successfully",
      { pricingStats }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get system overview for monitoring
// @route   GET /api/admin/system/overview
// @access  Admin
const getSystemOverview = async (req, res, next) => {
  try {
    // Booking conflicts (overlapping approved bookings)
    const bookingConflicts = await Booking.aggregate([
      { $match: { status: { $in: ["approved", "active"] } } },
      {
        $group: {
          _id: "$vehicle",
          count: { $sum: 1 },
          bookings: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    // Vehicle utilization rate
    const totalApprovedVehicles = await Vehicle.countDocuments({
      listingStatus: "approved",
    });
    const bookedVehicles = await Vehicle.countDocuments({
      listingStatus: "approved",
      status: "booked",
    });

    const utilizationRate =
      totalApprovedVehicles > 0
        ? ((bookedVehicles / totalApprovedVehicles) * 100).toFixed(2)
        : 0;

    // Booking conversion rate
    const totalBookingRequests = await Booking.countDocuments();
    const approvedBookings = await Booking.countDocuments({
      status: { $in: ["approved", "active", "completed"] },
    });
    const conversionRate =
      totalBookingRequests > 0
        ? ((approvedBookings / totalBookingRequests) * 100).toFixed(2)
        : 0;

    // Average rental duration
    const durationStats = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$totalDays" },
          totalCompleted: { $sum: 1 },
        },
      },
    ]);

    // Monthly active users
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyActiveUsers = await Booking.distinct("customer", {
      createdAt: { $gte: thirtyDaysAgo },
    });

    return ApiResponse.success(res, "System overview fetched", {
      kpis: {
        bookingConflicts: bookingConflicts.length,
        vehicleUtilizationRate: `${utilizationRate}%`,
        bookingConversionRate: `${conversionRate}%`,
        avgRentalDuration: `${Math.round(durationStats[0]?.avgDuration || 0)} days`,
        monthlyActiveUsers: monthlyActiveUsers.length,
        totalCompletedBookings: durationStats[0]?.totalCompleted || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  updateVehicleListingStatus,
  getPendingListings,
  getPricingOverview,
  getSystemOverview,
};