import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Car, Clock, CheckCircle2,
  XCircle, AlertCircle, Loader2, ArrowRight,
  RefreshCw, Shield, User, Sparkles, Eye,
} from "lucide-react";
import useBookingStore from "../../store/bookingStore";
import useAuth from "../../hooks/useAuth";
import { getImageUrl, formatPrice, formatDate } from "../../utils/helpers";
import { getVehicleFallback } from "../../utils/vehicleImages";
import toast from "react-hot-toast";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isOwner } = useAuth();
  const {
    bookings, ownerBookings, allBookings,
    pagination, isLoading,
    fetchMyBookings, fetchOwnerBookings, fetchAllBookings,
    cancelBooking,
  } = useBookingStore();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter, page]);

  const loadBookings = () => {
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;

    // 🔥 Role-based fetch
    if (isAdmin) {
      fetchAllBookings(params);
    } else if (isOwner) {
      fetchOwnerBookings(params);
    } else {
      fetchMyBookings(params);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    const result = await cancelBooking(bookingId, {
      cancellationReason: "Cancelled by " + (isAdmin ? "admin" : "customer"),
    });

    if (result.success) {
      toast.success("Booking cancelled successfully");
      loadBookings();
    } else {
      toast.error(result.message);
    }
    setCancellingId(null);
  };

  // 🔥 Get correct bookings based on role
  const getCurrentBookings = () => {
    if (isAdmin) return Array.isArray(allBookings) ? allBookings : [];
    if (isOwner) return Array.isArray(ownerBookings) ? ownerBookings : [];
    return Array.isArray(bookings) ? bookings : [];
  };

  const bookingsArray = getCurrentBookings();

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Pending Approval" },
    approved: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2, label: "Approved" },
    active: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Active" },
    completed: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle2, label: "Completed" },
    rejected: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Rejected" },
    cancelled: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Cancelled" },
  };

  const filters = [
    { value: "", label: "All Bookings" },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "approved", label: "Approved", icon: CheckCircle2 },
    { value: "active", label: "Active", icon: CheckCircle2 },
    { value: "completed", label: "Completed", icon: CheckCircle2 },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  // Get page title based on role
  const getPageTitle = () => {
    if (isAdmin) return "All Bookings";
    if (isOwner) return "Owner Bookings";
    return "My Bookings";
  };

  const getPageSubtitle = () => {
    if (isAdmin) return "Manage all customer bookings across the platform";
    if (isOwner) return "Manage bookings for your listed vehicles";
    return "Track your rental bookings";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-app">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold font-heading">
                {isAdmin && <span className="text-primary-600">👑 </span>}
                {isOwner && <span className="text-primary-600">🏢 </span>}
                <span className="gradient-text">{getPageTitle()}</span>
              </h1>
              {isAdmin && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                  ADMIN VIEW
                </span>
              )}
              {isOwner && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  OWNER VIEW
                </span>
              )}
            </div>
            <p className="text-secondary-600">
              {pagination?.total || bookingsArray.length} total bookings • {getPageSubtitle()}
            </p>
          </div>

          <button
            onClick={loadBookings}
            className="btn-outline btn-sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === f.value
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white border border-gray-200 hover:border-primary-300"
              }`}
            >
              {f.icon && <f.icon className="w-3.5 h-3.5" />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && bookingsArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-secondary-600">Loading bookings...</p>
          </div>
        ) : bookingsArray.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-16 text-center"
          >
            <div className="w-24 h-24 bg-primary-50 rounded-full flex-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {statusFilter ? `No ${statusFilter} bookings` : "No bookings yet"}
            </h3>
            <p className="text-secondary-500 mb-6 max-w-md mx-auto">
              {statusFilter
                ? `No ${statusFilter} bookings found.`
                : isAdmin
                ? "No bookings have been made on the platform yet."
                : isOwner
                ? "No bookings for your vehicles yet."
                : "Start exploring vehicles and book your first ride!"}
            </p>
            {!isAdmin && !isOwner && (
              <Link to="/vehicles" className="btn-primary btn-lg inline-flex">
                <Car className="w-5 h-5" />
                Browse Vehicles
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookingsArray.map((booking, index) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const vehicle = booking.vehicle || {};
              const vehicleImage = vehicle.images?.[0]?.url
                ? getImageUrl(vehicle.images[0].url)
                : getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model);

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-0">

                    {/* Image */}
                    <div className="md:col-span-1 aspect-video md:aspect-square overflow-hidden bg-white flex items-center justify-center p-4">
                      <img
                        src={vehicleImage}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model);
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="md:col-span-3 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-xl font-bold">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color} inline-flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-xs text-secondary-500 font-mono">
                            #{booking.bookingId || booking._id?.slice(-8).toUpperCase()}
                          </p>

                          {/* Admin/Owner: Show customer info */}
                          {(isAdmin || isOwner) && booking.customer && (
                            <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                <User className="w-3 h-3" />
                                <span className="font-semibold">
                                  {booking.customer.name || "Customer"}
                                </span>
                              </div>
                              {booking.customer.phone && (
                                <span className="text-secondary-500">
                                  📞 {booking.customer.phone}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Admin: Show owner info */}
                          {isAdmin && booking.owner && (
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                                <Shield className="w-3 h-3" />
                                <span className="font-semibold">
                                  Owner: {booking.owner.businessName || booking.owner.name}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-secondary-500 uppercase font-bold">Total</p>
                          <p className="text-2xl font-bold gradient-text">
                            {formatPrice(booking.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <p className="text-[10px] text-secondary-500 uppercase font-bold">Pickup</p>
                          <p className="text-xs font-semibold mt-0.5">{formatDate(booking.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <p className="text-[10px] text-secondary-500 uppercase font-bold">Return</p>
                          <p className="text-xs font-semibold mt-0.5">{formatDate(booking.endDate)}</p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <p className="text-[10px] text-secondary-500 uppercase font-bold">Duration</p>
                          <p className="text-xs font-semibold mt-0.5 capitalize">
                            {booking.totalDays} days ({booking.durationType})
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg">
                          <p className="text-[10px] text-secondary-500 uppercase font-bold">Location</p>
                          <p className="text-xs font-semibold mt-0.5 truncate">
                            {booking.location?.city || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Status Messages */}
                      {booking.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-800">
                            {isAdmin || isOwner
                              ? "Awaiting owner approval"
                              : "Waiting for owner approval. You'll be notified once approved."}
                          </p>
                        </div>
                      )}

                      {booking.status === "rejected" && booking.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-xs text-red-800">
                            <strong>Reason:</strong> {booking.rejectionReason}
                          </p>
                        </div>
                      )}

                      {booking.status === "approved" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            Booking approved! Pickup on {formatDate(booking.startDate)}
                          </p>
                        </div>
                      )}

                      {/* ═══ ACTIONS ═══ */}
                      <div className="flex flex-wrap gap-2">
                        {/* 🔥 Track Booking - Main Button (Premium Gradient) */}
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="btn-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Track Booking
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/vehicles/${vehicle._id}`}
                          className="btn-outline btn-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Vehicle
                        </Link>

                        {["pending", "approved"].includes(booking.status) && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          >
                            {cancellingId === booking._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                Cancel
                              </>
                            )}
                          </button>
                        )}

                        {booking.owner?.phone && !isAdmin && !isOwner && (
                          <a
                            href={`tel:${booking.owner.phone}`}
                            className="btn-sm bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                          >
                            📞 Call Owner
                          </a>
                        )}

                        {booking.customer?.phone && (isAdmin || isOwner) && (
                          <a
                            href={`tel:${booking.customer.phone}`}
                            className="btn-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                          >
                            📞 Call Customer
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-outline btn-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;