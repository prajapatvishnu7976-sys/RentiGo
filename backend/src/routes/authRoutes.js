const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators/authValidator");
const validate = require("../middleware/validate");

// Public routes
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

// Protected routes
router.use(protect);
router.post("/logout", logout);
router.get("/me", getMe);
router.put("/update-profile", updateProfile);
router.put("/change-password", changePasswordValidator, validate, changePassword);

module.exports = router;