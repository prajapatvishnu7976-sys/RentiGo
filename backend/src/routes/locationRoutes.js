const express = require("express");
const router = express.Router();
const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  toggleLocationStatus,
} = require("../controllers/locationController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

// Public routes
router.get("/", getAllLocations);
router.get("/:id", getLocationById);

// Admin only routes
router.use(protect, isAdmin);
router.post("/", createLocation);
router.put("/:id", updateLocation);
router.put("/:id/toggle-status", toggleLocationStatus);
router.delete("/:id", deleteLocation);

module.exports = router;