const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  updateVehicleListingStatus,
  getPendingListings,
  getPricingOverview,
  getSystemOverview,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

router.use(protect, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/vehicles/pending", getPendingListings);
router.put("/vehicles/:id/listing-status", updateVehicleListingStatus);
router.get("/pricing", getPricingOverview);
router.get("/system/overview", getSystemOverview);

module.exports = router;