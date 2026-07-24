module.exports = {
  ROLES: {
    CUSTOMER: "customer",
    OWNER: "owner",
    ADMIN: "admin",
  },

  VEHICLE_TYPES: {
    TWO_WHEELER: "2W",
    FOUR_WHEELER: "4W",
  },

  FUEL_TYPES: ["petrol", "diesel", "electric", "cng", "hybrid"],

  TRANSMISSION: ["manual", "automatic"],

  BOOKING_STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },

  VEHICLE_STATUS: {
    AVAILABLE: "available",
    BOOKED: "booked",
    MAINTENANCE: "maintenance",
    INACTIVE: "inactive",
  },

  LISTING_STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  },

  DURATION_TYPES: {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
  },

  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};