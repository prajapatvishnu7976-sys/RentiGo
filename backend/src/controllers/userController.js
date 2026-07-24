const User = require("../models/User");
const Booking = require("../models/Booking");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return ApiResponse.paginated(res, "Users fetched successfully", users, {
      page: parseInt(page),
      totalPages,
      total,
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    return ApiResponse.success(res, "User fetched successfully", { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (admin)
// @route   PUT /api/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return ApiResponse.badRequest(res, "isActive field is required");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return ApiResponse.badRequest(res, "You cannot deactivate your own account");
    }

    user.isActive = isActive;
    await user.save({ validateBeforeSave: false });

    return ApiResponse.success(
      res,
      `User ${isActive ? "activated" : "deactivated"} successfully`,
      { user }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    if (user._id.toString() === req.user._id.toString()) {
      return ApiResponse.badRequest(res, "You cannot delete your own account");
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      $or: [{ customer: user._id }, { owner: user._id }],
      status: { $in: ["pending", "approved", "active"] },
    });

    if (activeBookings > 0) {
      return ApiResponse.badRequest(
        res,
        `Cannot delete user with ${activeBookings} active booking(s)`
      );
    }

    await user.deleteOne();
    return ApiResponse.success(res, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get user booking history
// @route   GET /api/users/:id/bookings
// @access  Admin
const getUserBookings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.notFound(res, "User not found");
    }

    const bookings = await Booking.find({ customer: req.params.id })
      .populate("vehicle", "brand model vehicleNumber images type")
      .populate("location", "name city")
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, "User bookings fetched", { bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats (admin dashboard)
// @route   GET /api/users/stats
// @access  Admin
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const activeUsers = await User.countDocuments({
      role: "customer",
      isActive: true,
    });
    const newUsersThisMonth = await User.countDocuments({
      role: "customer",
      createdAt: {
        $gte: new Date(new Date().setDate(1)),
      },
    });

    return ApiResponse.success(res, "User stats fetched", {
      stats: {
        totalUsers,
        totalOwners,
        activeUsers,
        newUsersThisMonth,
        inactiveUsers: totalUsers - activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserBookings,
  getUserStats,
};