const express = require("express");
const router = express.Router();
const {
  getRevenueAnalytics,
  getBookingAnalytics,
  getFleetAnalytics,
  getUserAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { isAdmin, isAdminOrOwner } = require("../middleware/roleCheck");

router.use(protect);

router.get("/revenue", isAdminOrOwner, getRevenueAnalytics);
router.get("/bookings", isAdminOrOwner, getBookingAnalytics);
router.get("/fleet", isAdminOrOwner, getFleetAnalytics);
router.get("/users", isAdmin, getUserAnalytics);

module.exports = router;