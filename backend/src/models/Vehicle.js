const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
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
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
        "Invalid vehicle number format (e.g. MH12AB1234)",
      ],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    modelYear: {
      type: Number,
      required: [true, "Model year is required"],
      min: [2000, "Year must be 2000 or later"],
      max: [new Date().getFullYear() + 1, "Invalid year"],
    },
    type: {
      type: String,
      enum: ["2W", "4W"],
      required: [true, "Vehicle type is required"],
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "cng", "hybrid"],
      required: [true, "Fuel type is required"],
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      required: [true, "Transmission type is required"],
    },
    seatingCapacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: 1,
      max: 10,
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    pricing: {
      daily: {
        type: Number,
        required: [true, "Daily price is required"],
        min: [0, "Price cannot be negative"],
      },
      weekly: {
        type: Number,
        required: [true, "Weekly price is required"],
        min: [0, "Price cannot be negative"],
      },
      monthly: {
        type: Number,
        required: [true, "Monthly price is required"],
        min: [0, "Price cannot be negative"],
      },
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance", "inactive"],
      default: "available",
    },
    listingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
vehicleSchema.index({ type: 1, status: 1, listingStatus: 1 });
vehicleSchema.index({ location: 1 });
vehicleSchema.index({ "pricing.daily": 1 });
vehicleSchema.index({ fuelType: 1 });

// Virtual for display name
vehicleSchema.virtual("displayName").get(function () {
  return `${this.brand} ${this.model} (${this.modelYear})`;
});

module.exports = mongoose.model("Vehicle", vehicleSchema);