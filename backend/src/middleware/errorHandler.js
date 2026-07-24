const ApiResponse = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return ApiResponse.notFound(res, `Resource not found with id: ${err.value}`);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return ApiResponse.badRequest(
      res,
      `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return ApiResponse.badRequest(res, "Validation failed", errors);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, "Token expired. Please login again");
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return ApiResponse.badRequest(
      res,
      `File too large. Max size: ${process.env.MAX_FILE_SIZE / 1000000}MB`
    );
  }

  // Multer file type error
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return ApiResponse.badRequest(res, "Unexpected file field");
  }

  // Default error
  return ApiResponse.error(
    res,
    error.message || "Internal Server Error",
    error.statusCode || 500
  );
};

// Handle 404 routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };