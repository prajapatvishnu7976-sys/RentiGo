// ═══════════════════════════════════════════════════
// 🛠️  RentiGo - Helper Functions
// ═══════════════════════════════════════════════════

// ── Currency Formatters ────────────────────────────
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

export const formatPriceShort = (amount) => {
  if (!amount) return "₹0";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ── Date Formatters ────────────────────────────────
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";
  const defaultOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-IN", defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "N/A";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60)    return "Just now";
  if (diffMins < 60)    return `${diffMins}m ago`;
  if (diffHours < 24)   return `${diffHours}h ago`;
  if (diffDays < 7)     return `${diffDays}d ago`;
  return formatDate(date);
};

export const formatTimeOnly = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Date Calculations ──────────────────────────────
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const calculateBookingAmount = (pricing, durationType, startDate, endDate) => {
  const totalDays = calculateDays(startDate, endDate);
  if (!totalDays || totalDays <= 0) return { totalDays: 0, amount: 0 };

  let amount = 0;
  if (durationType === "monthly") {
    const months = Math.ceil(totalDays / 30);
    amount = months * (pricing?.monthly || 0);
  } else if (durationType === "weekly") {
    const weeks = Math.ceil(totalDays / 7);
    amount = weeks * (pricing?.weekly || 0);
  } else {
    amount = totalDays * (pricing?.daily || 0);
  }

  return { totalDays, amount };
};

export const calculateTotalWithFees = (subtotal, serviceFeePercent = 5, taxPercent = 18) => {
  const serviceFee = Math.round((subtotal * serviceFeePercent) / 100);
  const tax = Math.round((subtotal * taxPercent) / 100);
  const total = subtotal + serviceFee + tax;
  return { subtotal, serviceFee, tax, total };
};

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export const addDaysToDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
};

// ── String Utilities ───────────────────────────────
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};

// ── Image URL Helper ───────────────────────────────
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return `${baseURL}${imagePath.startsWith("/") ? imagePath : "/" + imagePath}`;
};

export const isValidImageUrl = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("unsplash") || url.includes("aeplcdn");
};

// ── Status Color Helpers ───────────────────────────
export const getVehicleStatusColor = (status) => {
  const colors = {
    available:   "success",
    booked:      "primary",
    maintenance: "warning",
    inactive:    "secondary",
  };
  return colors[status] || "secondary";
};

export const getBookingStatusColor = (status) => {
  const colors = {
    pending:   "warning",
    approved:  "primary",
    active:    "success",
    completed: "secondary",
    rejected:  "danger",
    cancelled: "danger",
  };
  return colors[status] || "secondary";
};

export const getListingStatusColor = (status) => {
  const colors = {
    pending:  "warning",
    approved: "success",
    rejected: "danger",
  };
  return colors[status] || "secondary";
};

export const getStatusBadgeClass = (status) => {
  const classes = {
    available:   "bg-success-50 text-success-600 border border-success-200",
    booked:      "bg-blue-50 text-blue-600 border border-blue-200",
    pending:     "bg-warning-50 text-warning-600 border border-warning-200",
    approved:    "bg-blue-50 text-blue-600 border border-blue-200",
    active:      "bg-success-50 text-success-600 border border-success-200",
    completed:   "bg-gray-100 text-gray-600 border border-gray-200",
    rejected:    "bg-danger-50 text-danger-600 border border-danger-200",
    cancelled:   "bg-danger-50 text-danger-500 border border-danger-200",
    maintenance: "bg-warning-50 text-warning-600 border border-warning-200",
    inactive:    "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return classes[status] || "bg-gray-100 text-gray-600";
};

// ── Validation Helpers ─────────────────────────────
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone?.replace(/\s|\+91|-/g, ""));
};

export const isValidLicense = (license) => {
  // Indian DL format: XX-NN-YYYY-NNNNNNN
  const regex = /^[A-Z]{2}[-\s]?\d{2}[-\s]?\d{4}[-\s]?\d{7}$/;
  return regex.test(license?.replace(/\s/g, "").toUpperCase());
};

// ── Utility Functions ──────────────────────────────
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateBookingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RG-${timestamp}-${random}`;
};

export const generateRandomColor = () => {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getDurationLabel = (durationType) => {
  const labels = {
    daily:   "Day",
    weekly:  "Week",
    monthly: "Month",
  };
  return labels[durationType] || durationType;
};

export const getDurationLabelPlural = (durationType, count = 1) => {
  const labels = {
    daily:   count === 1 ? "Day" : "Days",
    weekly:  count === 1 ? "Week" : "Weeks",
    monthly: count === 1 ? "Month" : "Months",
  };
  return labels[durationType] || durationType;
};

// ── URL Helpers ────────────────────────────────────
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

// ── Local Storage Helpers ──────────────────────────
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("LocalStorage error:", e);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

// ── Number Formatters ──────────────────────────────
export const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatCompactNumber = (num) => {
  if (!num) return "0";
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ── Vehicle Specific Helpers ───────────────────────
export const getVehicleTypeIcon = (type) => {
  return type === "2W" ? "🏍️" : "🚗";
};

export const getVehicleTypeLabel = (type) => {
  return type === "2W" ? "Two Wheeler" : "Four Wheeler";
};

export const getFuelTypeIcon = (fuelType) => {
  const icons = {
    Petrol:   "⛽",
    Diesel:   "🛢️",
    Electric: "⚡",
    CNG:      "💨",
    Hybrid:   "🔋",
  };
  return icons[fuelType] || "⛽";
};

// ── Copy to Clipboard ──────────────────────────────
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// ── Scroll to Top ──────────────────────────────────
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "instant",
  });
};

// ── Get Greeting ───────────────────────────────────
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

// ── File Size Formatter ────────────────────────────
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};