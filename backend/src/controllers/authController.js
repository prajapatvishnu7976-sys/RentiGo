const User = require("../models/User");
const { sendTokenResponse } = require("../utils/generateToken");
const ApiResponse = require("../utils/apiResponse");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, businessName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.badRequest(res, "Email already registered");
    }

    // Check phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return ApiResponse.badRequest(res, "Phone number already registered");
    }

    // Create user
    const userData = { name, email, password, phone, role: role || "customer" };
    if (role === "owner" && businessName) {
      userData.businessName = businessName;
    }

    const user = await User.create(userData);

    sendTokenResponse(user, 201, res, "Registration successful! Welcome to RentiGo 🎉");
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check user exists with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ApiResponse.unauthorized(res, "Invalid email or password");
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.unauthorized(res, "Invalid email or password");
    }

    // Check if account is active
    if (!user.isActive) {
      return ApiResponse.unauthorized(
        res,
        "Your account has been deactivated. Please contact admin"
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, `Welcome back, ${user.name}! 👋`);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    return ApiResponse.success(res, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, "User profile fetched", { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "address",
      "businessName",
      "businessAddress",
      "licenseNumber",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return ApiResponse.success(res, "Profile updated successfully", { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.badRequest(res, "Current password is incorrect");
    }

    // Check new password is different
    const isSame = await user.matchPassword(newPassword);
    if (isSame) {
      return ApiResponse.badRequest(
        res,
        "New password must be different from current password"
      );
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};