export const formatPrice = (price) => {
  if (!price && price !== 0) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

export const formatPricingDisplay = (pricing, durationType = "daily") => {
  if (!pricing) return "N/A";
  const price = pricing[durationType];
  const labels = { daily: "/day", weekly: "/week", monthly: "/month" };
  return `₹${Number(price).toLocaleString("en-IN")}${labels[durationType]}`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "N/A";
  return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
};

export const formatVehicleType = (type) => {
  return type === "2W" ? "Two Wheeler" : "Four Wheeler";
};

export const formatFuelType = (fuel) => {
  const labels = {
    petrol:   "Petrol",
    diesel:   "Diesel",
    electric: "Electric",
    cng:      "CNG",
    hybrid:   "Hybrid",
  };
  return labels[fuel] || fuel;
};

export const formatTransmission = (transmission) => {
  return transmission === "manual" ? "Manual" : "Automatic";
};

export const formatBookingStatus = (status) => {
  const labels = {
    pending:   "Pending",
    approved:  "Approved",
    active:    "Active",
    completed: "Completed",
    rejected:  "Rejected",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

export const formatDurationType = (type) => {
  const labels = {
    daily:   "Daily",
    weekly:  "Weekly",
    monthly: "Monthly",
  };
  return labels[type] || type;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatPercentage = (value, total) => {
  if (!total) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return Number(num).toLocaleString("en-IN");
};

export const formatRating = (rating) => {
  if (!rating) return "0.0";
  return Number(rating).toFixed(1);
};