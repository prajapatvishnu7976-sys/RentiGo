const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load env vars
dotenv.config();

// DB Connection
const connectDB = require("./src/config/db");
connectDB();

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const locationRoutes = require("./src/routes/locationRoutes");

// Error handlers
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();

// ─── Security Middleware ───────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ─── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes",
  },
});

app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── General Middleware ────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── Logger ───────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Static Files ─────────────────────────────────────────
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "7d",
  })
);

// ─── Health Check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentiGo API is running! 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ─── API Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/locations", locationRoutes);

// ─── 404 Handler ──────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("\n🚀 ════════════════════════════════════════");
  console.log(`   RentiGo Server Running!`);
  console.log(`   Mode:    ${process.env.NODE_ENV}`);
  console.log(`   Port:    ${PORT}`);
  console.log(`   URL:     http://localhost:${PORT}`);
  console.log(`   API:     http://localhost:${PORT}/api`);
  console.log("🚀 ════════════════════════════════════════\n");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

module.exports = app;