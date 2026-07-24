const ApiResponse = require("../utils/apiResponse");

// Check single role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Please login first");
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

// Shorthand role checkers
const isAdmin = authorize("admin");
const isOwner = authorize("owner");
const isCustomer = authorize("customer");
const isAdminOrOwner = authorize("admin", "owner");
const isOwnerOrCustomer = authorize("owner", "customer");

// Check if user owns the resource or is admin
const isOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Please login first");
    }

    const userId = req.user._id.toString();
    const resourceId =
      typeof resourceUserId === "function"
        ? resourceUserId(req)
        : resourceUserId;

    if (userId !== resourceId.toString() && req.user.role !== "admin") {
      return ApiResponse.forbidden(
        res,
        "Access denied. You can only access your own resources"
      );
    }

    next();
  };
};

module.exports = {
  authorize,
  isAdmin,
  isOwner,
  isCustomer,
  isAdminOrOwner,
  isOwnerOrCustomer,
  isOwnerOrAdmin,
};