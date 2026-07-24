const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserBookings,
  getUserStats,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

router.use(protect, isAdmin);

router.get("/", getAllUsers);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);
router.get("/:id/bookings", getUserBookings);
router.put("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;