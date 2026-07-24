const express = require("express");
const router = express.Router();
const {
  getAllVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicleImage,
  deleteVehicle,
  getMyVehicles,
  toggleMaintenance,
  getAllVehiclesAdmin,
} = require("../controllers/vehicleController");
const { protect } = require("../middleware/auth");
const { isOwner, isAdmin, isAdminOrOwner } = require("../middleware/roleCheck");
const { uploadMultiple, handleUploadError } = require("../middleware/upload");
const {
  addVehicleValidator,
  updateVehicleValidator,
} = require("../validators/vehicleValidator");
const validate = require("../middleware/validate");

// Public routes
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

// Protected routes
router.use(protect);

// Owner routes
router.get("/owner/my-vehicles", isOwner, getMyVehicles);
router.post(
  "/",
  isOwner,
  uploadMultiple,
  handleUploadError,
  addVehicleValidator,
  validate,
  addVehicle
);
router.put(
  "/:id",
  isAdminOrOwner,
  uploadMultiple,
  handleUploadError,
  updateVehicleValidator,
  validate,
  updateVehicle
);
router.put("/:id/maintenance", isOwner, toggleMaintenance);
router.delete("/:id/images/:filename", isAdminOrOwner, deleteVehicleImage);
router.delete("/:id", isAdminOrOwner, deleteVehicle);

// Admin routes
router.get("/admin/all", isAdmin, getAllVehiclesAdmin);

module.exports = router;