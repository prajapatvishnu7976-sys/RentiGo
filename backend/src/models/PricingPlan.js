const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["2W", "4W", "all"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    basePrice: {
      daily: { type: Number, required: true, min: 0 },
      weekly: { type: Number, required: true, min: 0 },
      monthly: { type: Number, required: true, min: 0 },
    },
    discountPercentage: {
      weekly: { type: Number, default: 10, min: 0, max: 100 },
      monthly: { type: Number, default: 20, min: 0, max: 100 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PricingPlan", pricingPlanSchema);