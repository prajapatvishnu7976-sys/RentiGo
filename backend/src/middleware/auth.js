const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ApiResponse.unauthorized(res, "Access denied. Please login first");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.unauthorized(res, "User no longer exists");
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(
        res,
        "Your account has been deactivated. Contact admin"
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return ApiResponse.unauthorized(res, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      return ApiResponse.unauthorized(res, "Token expired. Please login again");
    }
    return ApiResponse.error(res, "Authentication failed", 500);
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, optionalAuth };