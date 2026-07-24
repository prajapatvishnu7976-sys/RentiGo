const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    bookingId: {
      type: String,
      unique: true,
    },
    durationType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: [true, "Duration type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: String,
      enum: ["customer", "owner", "admin", null],
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    customerNotes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
    ownerNotes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ FIXED: Auto-generate booking ID without 'next' parameter
bookingSchema.pre("save", async function () {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingId = `RG-${timestamp}-${random}`;
  }
});

// Index for faster queries
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ vehicle: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

// Virtual for duration display
bookingSchema.virtual("duration").get(function () {
  return `${this.totalDays} days`;
});

module.exports = mongoose.model("Booking", bookingSchema);