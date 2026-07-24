const { body } = require("express-validator");

const createBookingValidator = [
  body("vehicleId").notEmpty().withMessage("Vehicle ID is required"),

  body("durationType")
    .notEmpty()
    .withMessage("Duration type is required")
    .isIn(["daily", "weekly", "monthly"])
    .withMessage("Duration type must be daily, weekly or monthly"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date format")
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date format")
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("customerNotes")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Notes cannot exceed 300 characters"),
];

// ✅ FIXED: Added "active" to allowed statuses
const updateBookingStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected", "active", "completed", "cancelled"])
    .withMessage("Invalid status"),

  body("rejectionReason")
    .if(body("status").equals("rejected"))
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting a booking"),

  body("cancellationReason")
    .if(body("status").equals("cancelled"))
    .notEmpty()
    .withMessage("Cancellation reason is required when cancelling a booking"),
];

module.exports = { createBookingValidator, updateBookingStatusValidator };