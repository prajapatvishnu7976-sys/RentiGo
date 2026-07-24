const { body } = require("express-validator");

const addVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required")
    .toUpperCase()
    .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)
    .withMessage("Invalid vehicle number format (e.g. MH12AB1234)"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Brand must be between 2 and 30 characters"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Model is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Model must be between 1 and 50 characters"),

  body("modelYear")
    .notEmpty()
    .withMessage("Model year is required")
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 2000 and ${new Date().getFullYear() + 1}`),

  body("type")
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["2W", "4W"])
    .withMessage("Vehicle type must be 2W or 4W"),

  body("fuelType")
    .notEmpty()
    .withMessage("Fuel type is required")
    .isIn(["petrol", "diesel", "electric", "cng", "hybrid"])
    .withMessage("Invalid fuel type"),

  body("transmission")
    .notEmpty()
    .withMessage("Transmission type is required")
    .isIn(["manual", "automatic"])
    .withMessage("Transmission must be manual or automatic"),

  body("seatingCapacity")
    .notEmpty()
    .withMessage("Seating capacity is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Seating capacity must be between 1 and 10"),

  body("pricing.daily")
    .notEmpty()
    .withMessage("Daily price is required")
    .isFloat({ min: 0 })
    .withMessage("Daily price must be a positive number"),

  body("pricing.weekly")
    .notEmpty()
    .withMessage("Weekly price is required")
    .isFloat({ min: 0 })
    .withMessage("Weekly price must be a positive number"),

  body("pricing.monthly")
    .notEmpty()
    .withMessage("Monthly price is required")
    .isFloat({ min: 0 })
    .withMessage("Monthly price must be a positive number"),

  body("location").notEmpty().withMessage("Location is required"),
];

const updateVehicleValidator = [
  body("brand")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Brand must be between 2 and 30 characters"),

  body("model")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Model must be between 1 and 50 characters"),

  body("fuelType")
    .optional()
    .isIn(["petrol", "diesel", "electric", "cng", "hybrid"])
    .withMessage("Invalid fuel type"),

  body("transmission")
    .optional()
    .isIn(["manual", "automatic"])
    .withMessage("Transmission must be manual or automatic"),

  body("pricing.daily")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Daily price must be a positive number"),

  body("pricing.weekly")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weekly price must be a positive number"),

  body("pricing.monthly")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly price must be a positive number"),
];

module.exports = { addVehicleValidator, updateVehicleValidator };