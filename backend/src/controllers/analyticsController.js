const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Admin / Owner
const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = "monthly", year = new Date().getFullYear() } = req.query;

    const matchQuery = { status: "completed" };

    // If owner, only their revenue
    if (req.user.role === "owner") {
      matchQuery.owner = req.user._id;
    }

    // Monthly revenue for the year
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
          avgBookingValue: { $avg: "$totalAmount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Fill missing months with 0
    const fullYearData = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyRevenue.find((m) => m._id.month === i + 1);
      return {
        month: i + 1,
        monthName: new Date(year, i, 1).toLocaleString("default", {
          month: "long",
        }),
        revenue: monthData?.revenue || 0,
        bookings: monthData?.bookings || 0,
        avgBookingValue: Math.round(monthData?.avgBookingValue || 0),
      };
    });

    // Revenue by vehicle type
    const revenueByType = await Booking.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicle",
          foreignField: "_id",
          as: "vehicleData",
        },
      },
      { $unwind: "$vehicleData" },
      {
        $group: {
          _id: "$vehicleData.type",
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
    ]);

    // Revenue by duration type
    const revenueByDuration = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$durationType",
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
    ]);

    // Total stats
    const totalStats = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
          avgRevenue: { $avg: "$totalAmount" },
        },
      },
    ]);

    return ApiResponse.success(res, "Revenue analytics fetched", {
      yearlyData: fullYearData,
      revenueByType,
      revenueByDuration,
      summary: {
        totalRevenue: totalStats[0]?.totalRevenue || 0,
        totalBookings: totalStats[0]?.totalBookings || 0,
        avgBookingValue: Math.round(totalStats[0]?.avgRevenue || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking analytics
// @route   GET /api/analytics/bookings
// @access  Admin / Owner
const getBookingAnalytics = async (req, res, next) => {
  try {
    const matchQuery = {};
    if (req.user.role === "owner") {
      matchQuery.owner = req.user._id;
    }

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Daily bookings last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyBookings = await Booking.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Top booked vehicles
    const topVehicles = await Booking.aggregate([
      { $match: { ...matchQuery, status: "completed" } },
      {
        $group: {
          _id: "$vehicle",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $project: {
          totalBookings: 1,
          totalRevenue: 1,
          "vehicle.brand": 1,
          "vehicle.model": 1,
          "vehicle.vehicleNumber": 1,
          "vehicle.type": 1,
          "vehicle.images": 1,
        },
      },
    ]);

    // Average booking duration
    const durationStats = await Booking.aggregate([
      { $match: { ...matchQuery, status: "completed" } },
      {
        $group: {
          _id: "$durationType",
          count: { $sum: 1 },
          avgDays: { $avg: "$totalDays" },
        },
      },
    ]);

    return ApiResponse.success(res, "Booking analytics fetched", {
      bookingsByStatus,
      dailyBookings,
      topVehicles,
      durationStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get fleet analytics
// @route   GET /api/analytics/fleet
// @access  Admin / Owner
const getFleetAnalytics = async (req, res, next) => {
  try {
    const matchQuery = { listingStatus: "approved" };
    if (req.user.role === "owner") {
      matchQuery.owner = req.user._id;
    }

    // Vehicles by type
    const vehiclesByType = await Vehicle.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgRating: { $avg: "$averageRating" },
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
    ]);

    // Vehicles by fuel type
    const vehiclesByFuel = await Vehicle.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$fuelType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Vehicles by status
    const vehiclesByStatus = await Vehicle.aggregate([
      { $match: { ...(req.user.role === "owner" ? { owner: req.user._id } : {}) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performing vehicles
    const topPerformers = await Vehicle.find(matchQuery)
      .sort({ totalRevenue: -1, totalBookings: -1 })
      .limit(5)
      .populate("location", "name city")
      .select(
        "brand model vehicleNumber type totalBookings totalRevenue averageRating images"
      );

    // Vehicles needing attention (low utilization)
    const lowUtilization = await Vehicle.find({
      ...matchQuery,
      status: "available",
      totalBookings: { $lt: 3 },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("brand model vehicleNumber type totalBookings createdAt");

    return ApiResponse.success(res, "Fleet analytics fetched", {
      vehiclesByType,
      vehiclesByFuel,
      vehiclesByStatus,
      topPerformers,
      lowUtilization,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics (Admin only)
// @route   GET /api/analytics/users
// @access  Admin
const getUserAnalytics = async (req, res, next) => {
  try {
    // User growth last 12 months
    const userGrowth = await User.aggregate([
      { $match: { role: "customer" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Top customers by bookings
    const topCustomers = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$customer",
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          totalBookings: 1,
          totalSpent: 1,
          "customer.name": 1,
          "customer.email": 1,
          "customer.phone": 1,
        },
      },
    ]);

    // Top owners by revenue
    const topOwners = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$owner",
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          totalRevenue: 1,
          totalBookings: 1,
          "owner.name": 1,
          "owner.email": 1,
          "owner.businessName": 1,
        },
      },
    ]);

    return ApiResponse.success(res, "User analytics fetched", {
      userGrowth,
      topCustomers,
      topOwners,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevenueAnalytics,
  getBookingAnalytics,
  getFleetAnalytics,
  getUserAnalytics,
};