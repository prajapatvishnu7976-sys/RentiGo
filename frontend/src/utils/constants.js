export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ROLES = {
  CUSTOMER: "customer",
  OWNER: "owner",
  ADMIN: "admin",
};

export const VEHICLE_TYPES = [
  { value: "2W", label: "Two Wheeler", icon: "🛵" },
  { value: "4W", label: "Four Wheeler", icon: "🚗" },
];

export const FUEL_TYPES = [
  { value: "petrol",   label: "Petrol",   color: "orange" },
  { value: "diesel",   label: "Diesel",   color: "gray"   },
  { value: "electric", label: "Electric", color: "green"  },
  { value: "cng",      label: "CNG",      color: "teal"   },
  { value: "hybrid",   label: "Hybrid",   color: "lime"   },
];

export const TRANSMISSION_TYPES = [
  { value: "manual",    label: "Manual"    },
  { value: "automatic", label: "Automatic" },
];

export const DURATION_TYPES = [
  { value: "daily",   label: "Daily",   unit: "day",   multiplier: 1  },
  { value: "weekly",  label: "Weekly",  unit: "week",  multiplier: 7  },
  { value: "monthly", label: "Monthly", unit: "month", multiplier: 30 },
];

export const BOOKING_STATUSES = [
  { value: "pending",   label: "Pending",   color: "yellow" },
  { value: "approved",  label: "Approved",  color: "blue"   },
  { value: "active",    label: "Active",    color: "green"  },
  { value: "completed", label: "Completed", color: "gray"   },
  { value: "rejected",  label: "Rejected",  color: "red"    },
  { value: "cancelled", label: "Cancelled", color: "red"    },
];

export const VEHICLE_STATUSES = [
  { value: "available",   label: "Available",   color: "green"  },
  { value: "booked",      label: "Booked",      color: "blue"   },
  { value: "maintenance", label: "Maintenance", color: "yellow" },
  { value: "inactive",    label: "Inactive",    color: "gray"   },
];

export const LISTING_STATUSES = [
  { value: "pending",  label: "Pending",  color: "yellow" },
  { value: "approved", label: "Approved", color: "green"  },
  { value: "rejected", label: "Rejected", color: "red"    },
];

export const PRICE_RANGES = [
  { label: "Under ₹500",        min: 0,    max: 500   },
  { label: "₹500 - ₹1000",     min: 500,  max: 1000  },
  { label: "₹1000 - ₹2000",    min: 1000, max: 2000  },
  { label: "₹2000 - ₹5000",    min: 2000, max: 5000  },
  { label: "Above ₹5000",       min: 5000, max: 99999 },
];

export const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First"      },
  { value: "createdAt_asc",  label: "Oldest First"      },
  { value: "price_asc",      label: "Price: Low to High"},
  { value: "price_desc",     label: "Price: High to Low"},
  { value: "rating_desc",    label: "Top Rated"         },
];

export const ITEMS_PER_PAGE = 10;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];