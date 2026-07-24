const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Location = require("../models/Location");
const ApiResponse = require("../utils/apiResponse");
const fs = require("fs");
const path = require("path");

// @desc    Get all approved vehicles (public)
// @route   GET /api/vehicles
// @access  Public
const getAllVehicles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      fuelType,
      transmission,
      location,
      city,
      category,
      minPrice,
      maxPrice,
      durationType = "daily",
      search,
      q,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {
      listingStatus: "approved",
      isActive: true,
    };

    // Vehicle type filter
    if (type) query.type = type;
    if (fuelType) query.fuelType = { $regex: new RegExp(`^${fuelType}$`, "i") };
    if (transmission) query.transmission = { $regex: new RegExp(`^${transmission}$`, "i") };

    // Direct location ID filter
    if (location) query.location = location;

    // ═══ CITY FILTER - Find locations by city name first ═══
    if (city) {
      const cityLocations = await Location.find({
        city: { $regex: new RegExp(city, "i") },
        isActive: true,
      }).select("_id");

      if (cityLocations.length > 0) {
        query.location = { $in: cityLocations.map((l) => l._id) };
      } else {
        // No locations found for this city - return empty
        return ApiResponse.paginated(res, "No vehicles found in this city", [], {
          page: 1,
          totalPages: 0,
          total: 0,
          limit: parseInt(limit),
        });
      }
    }

    // Category filter (stored in description or features for now)
    if (category) {
      query.$or = query.$or || [];
      query.$or.push(
        { brand: { $regex: category, $options: "i" } },
        { model: { $regex: category, $options: "i" } },
        { description: { $regex: category, $options: "i" } }
      );
    }

    // Price filter
    if (minPrice || maxPrice) {
      const priceField = `pricing.${durationType}`;
      query[priceField] = {};
      if (minPrice) query[priceField].$gte = parseFloat(minPrice);
      if (maxPrice) query[priceField].$lte = parseFloat(maxPrice);
    }

    // Search by brand, model, or description
    const searchTerm = search || q;
    if (searchTerm) {
      const searchQuery = [
        { brand: { $regex: searchTerm, $options: "i" } },
        { model: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { vehicleNumber: { $regex: searchTerm, $options: "i" } },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchQuery }];
        delete query.$or;
      } else {
        query.$or = searchQuery;
      }
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case "price-low":
        sortOptions = { [`pricing.${durationType}`]: 1 };
        break;
      case "price-high":
        sortOptions = { [`pricing.${durationType}`]: -1 };
        break;
      case "rating":
        sortOptions = { averageRating: -1 };
        break;
      case "popular":
        sortOptions = { totalBookings: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    }

    const total = await Vehicle.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const vehicles = await Vehicle.find(query)
      .populate("owner", "name phone businessName")
      .populate("location", "name city state address")
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "Vehicles fetched successfully",
      vehicles,
      {
        page: parseInt(page),
        totalPages,
        total,
        limit: parseInt(limit),
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("owner", "name phone businessName avatar email")
      .populate("location", "name city state address pincode");

    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    return ApiResponse.success(res, "Vehicle fetched successfully", {
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Owner
const addVehicle = async (req, res, next) => {
  try {
    const {
      vehicleNumber,
      brand,
      model,
      modelYear,
      type,
      fuelType,
      transmission,
      seatingCapacity,
      color,
      description,
      features,
      pricing,
      location,
    } = req.body;

    // Check location exists
    const locationExists = await Location.findById(location);
    if (!locationExists) {
      return ApiResponse.notFound(res, "Location not found");
    }

    // Check vehicle number already exists
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: vehicleNumber.toUpperCase(),
    });
    if (existingVehicle) {
      return ApiResponse.badRequest(
        res,
        "Vehicle with this number already registered"
      );
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push({
          url: `/uploads/vehicles/${file.filename}`,
          filename: file.filename,
        });
      });
    }

    // Parse features if string
    let parsedFeatures = features;
    if (typeof features === "string") {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features.split(",").map((f) => f.trim());
      }
    }

    // Parse pricing if string
    let parsedPricing = pricing;
    if (typeof pricing === "string") {
      parsedPricing = JSON.parse(pricing);
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      vehicleNumber: vehicleNumber.toUpperCase(),
      brand,
      model,
      modelYear,
      type,
      fuelType,
      transmission,
      seatingCapacity,
      color,
      description,
      features: parsedFeatures || [],
      images,
      pricing: parsedPricing,
      location,
      listingStatus: "pending",
    });

    await vehicle.populate("location", "name city state");

    return ApiResponse.created(
      res,
      "Vehicle added successfully! Awaiting admin approval 🚗",
      { vehicle }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Owner
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return ApiResponse.forbidden(
        res,
        "You are not authorized to update this vehicle"
      );
    }

    const activeBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ["approved", "active"] },
    });

    if (activeBooking) {
      return ApiResponse.badRequest(
        res,
        "Cannot update vehicle with active bookings"
      );
    }

    const allowedUpdates = [
      "brand", "model", "color", "description",
      "features", "pricing", "fuelType", "transmission",
      "seatingCapacity", "status",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        vehicle[field] = req.body[field];
      }
    });

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/vehicles/${file.filename}`,
        filename: file.filename,
      }));
      vehicle.images = [...vehicle.images, ...newImages].slice(0, 5);
    }

    if (req.user.role === "owner") {
      vehicle.listingStatus = "pending";
    }

    await vehicle.save();
    await vehicle.populate("location", "name city state");

    return ApiResponse.success(res, "Vehicle updated successfully", {
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle image
// @route   DELETE /api/vehicles/:id/images/:filename
// @access  Owner
const deleteVehicleImage = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return ApiResponse.forbidden(res, "Not authorized");
    }

    const { filename } = req.params;
    const imageIndex = vehicle.images.findIndex(
      (img) => img.filename === filename
    );

    if (imageIndex === -1) {
      return ApiResponse.notFound(res, "Image not found");
    }

    const filePath = path.join(
      process.env.FILE_UPLOAD_PATH || "./uploads/vehicles",
      filename
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    vehicle.images.splice(imageIndex, 1);
    await vehicle.save();

    return ApiResponse.success(res, "Image deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Owner / Admin
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return ApiResponse.forbidden(res, "Not authorized to delete this vehicle");
    }

    const activeBookings = await Booking.countDocuments({
      vehicle: vehicle._id,
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeBookings > 0) {
      return ApiResponse.badRequest(
        res,
        `Cannot delete vehicle with ${activeBookings} active booking(s)`
      );
    }

    vehicle.images.forEach((img) => {
      const filePath = path.join(
        process.env.FILE_UPLOAD_PATH || "./uploads/vehicles",
        img.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await vehicle.deleteOne();
    return ApiResponse.success(res, "Vehicle deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's vehicles
// @route   GET /api/vehicles/my-vehicles
// @access  Owner
const getMyVehicles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, listingStatus } = req.query;

    const query = { owner: req.user._id };
    if (status) query.status = status;
    if (listingStatus) query.listingStatus = listingStatus;

    const total = await Vehicle.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const vehicles = await Vehicle.find(query)
      .populate("location", "name city state")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return ApiResponse.paginated(
      res,
      "Your vehicles fetched successfully",
      vehicles,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle maintenance
// @route   PUT /api/vehicles/:id/maintenance
// @access  Owner
const toggleMaintenance = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return ApiResponse.notFound(res, "Vehicle not found");
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return ApiResponse.forbidden(res, "Not authorized");
    }

    if (vehicle.status === "booked") {
      return ApiResponse.badRequest(
        res,
        "Cannot set maintenance mode for a booked vehicle"
      );
    }

    vehicle.status =
      vehicle.status === "maintenance" ? "available" : "maintenance";
    await vehicle.save();

    return ApiResponse.success(
      res,
      `Vehicle ${vehicle.status === "maintenance" ? "set to maintenance" : "set to available"}`,
      { vehicle }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles admin
// @route   GET /api/vehicles/admin/all
// @access  Admin
const getAllVehiclesAdmin = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      listingStatus,
      status,
      type,
      search,
      city,
    } = req.query;

    const query = {};
    if (listingStatus) query.listingStatus = listingStatus;
    if (status) query.status = status;
    if (type) query.type = type;

    // City filter for admin
    if (city) {
      const cityLocations = await Location.find({
        city: { $regex: new RegExp(city, "i") },
      }).select("_id");
      if (cityLocations.length > 0) {
        query.location = { $in: cityLocations.map((l) => l._id) };
      }
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { vehicleNumber: { $regex: search, $options: "i" } },
      ];
    }

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
      "All vehicles fetched successfully",
      vehicles,
      { page: parseInt(page), totalPages, total, limit: parseInt(limit) }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicleImage,
  deleteVehicle,
  getMyVehicles,
  toggleMaintenance,
  getAllVehiclesAdmin,
};