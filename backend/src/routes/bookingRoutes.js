const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getOwnerBookings,
  getAllBookingsAdmin,
  checkAvailability,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");
const { isCustomer, isAdminOrOwner, isAdmin } = require("../middleware/roleCheck");
const {
  createBookingValidator,
  updateBookingStatusValidator,
} = require("../validators/bookingValidator");
const validate = require("../middleware/validate");

router.use(protect);

// Check availability (any logged in user)
router.post("/check-availability", checkAvailability);

// Customer routes
router.get("/my-bookings", isCustomer, getMyBookings);
router.post("/", isCustomer, createBookingValidator, validate, createBooking);
router.put("/:id/cancel", isCustomer, cancelBooking);

// Owner routes
router.get("/owner-bookings", isAdminOrOwner, getOwnerBookings);
router.put(
  "/:id/status",
  isAdminOrOwner,
  updateBookingStatusValidator,
  validate,
  updateBookingStatus
);

// Admin routes
router.get("/admin/all", isAdmin, getAllBookingsAdmin);

// Single booking (any authorized user)
router.get("/:id", getBookingById);

module.exports = router;