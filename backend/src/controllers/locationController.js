const Location = require("../models/Location");
const Vehicle = require("../models/Vehicle");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get all active locations
// @route   GET /api/locations
// @access  Public
const getAllLocations = async (req, res, next) => {
  try {
    const { search, city, state } = req.query;

    const query = { isActive: true };
    if (city) query.city = { $regex: city, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const locations = await Location.find(query).sort({ city: 1, name: 1 });

    return ApiResponse.success(res, "Locations fetched successfully", {
      locations,
      total: locations.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return ApiResponse.notFound(res, "Location not found");
    }

    // Get vehicles count at this location
    const vehiclesCount = await Vehicle.countDocuments({
      location: location._id,
      listingStatus: "approved",
      status: "available",
    });

    return ApiResponse.success(res, "Location fetched successfully", {
      location: { ...location.toObject(), availableVehicles: vehiclesCount },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create location
// @route   POST /api/locations
// @access  Admin
const createLocation = async (req, res, next) => {
  try {
    const { name, city, state, pincode, address } = req.body;

    if (!name || !city || !state || !pincode) {
      return ApiResponse.badRequest(
        res,
        "Name, city, state and pincode are required"
      );
    }

    const location = await Location.create({
      name,
      city,
      state,
      pincode,
      address,
    });

    return ApiResponse.created(res, "Location created successfully", {
      location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Admin
const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return ApiResponse.notFound(res, "Location not found");
    }

    return ApiResponse.success(res, "Location updated successfully", {
      location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Admin
const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return ApiResponse.notFound(res, "Location not found");
    }

    // Check for vehicles at this location
    const vehiclesCount = await Vehicle.countDocuments({
      location: location._id,
    });

    if (vehiclesCount > 0) {
      return ApiResponse.badRequest(
        res,
        `Cannot delete location with ${vehiclesCount} vehicle(s) assigned`
      );
    }

    await location.deleteOne();
    return ApiResponse.success(res, "Location deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle location status
// @route   PUT /api/locations/:id/toggle-status
// @access  Admin
const toggleLocationStatus = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return ApiResponse.notFound(res, "Location not found");
    }

    location.isActive = !location.isActive;
    await location.save();

    return ApiResponse.success(
      res,
      `Location ${location.isActive ? "activated" : "deactivated"} successfully`,
      { location }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  toggleLocationStatus,
};