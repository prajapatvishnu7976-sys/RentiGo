import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Clock, XCircle, AlertCircle,
  MapPin, Calendar, Car, User, Phone, Mail, Shield,
  CreditCard, FileText, MessageCircle, Copy, Loader2,
  Star, Download, RefreshCw, Bike, Fuel, Settings, Users,
  Info, HelpCircle, ChevronRight, Sparkles, Truck,
  PackageCheck, Home, Award,
} from "lucide-react";
import useBookingStore from "../../store/bookingStore";
import useAuth from "../../hooks/useAuth";
import { getImageUrl, formatPrice, formatDate, formatDateTime } from "../../utils/helpers";
import { getVehicleFallback } from "../../utils/vehicleImages";
import { generateInvoicePDF } from "../../utils/invoiceGenerator";
import toast from "react-hot-toast";

const BookingTrackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isOwner } = useAuth();
  const { fetchBookingById, cancelBooking, isLoading } = useBookingStore();

  const [booking, setBooking] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  useEffect(() => {
    let interval;
    if (autoRefresh && booking && !["completed", "cancelled", "rejected"].includes(booking.status)) {
      interval = setInterval(() => {
        loadBooking(true);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, booking?.status]);

  const loadBooking = async (silent = false) => {
    if (!silent) setRefreshing(true);
    const data = await fetchBookingById(id);
    if (data) {
      setBooking(data);
    }
    setRefreshing(false);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide cancellation reason");
      return;
    }

    const result = await cancelBooking(id, { cancellationReason: cancelReason });
    if (result.success) {
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      loadBooking();
    } else {
      toast.error(result.message);
    }
  };

  // 🔥 Download Invoice PDF
  const handleDownloadInvoice = () => {
    if (!booking) {
      toast.error("Booking data not loaded");
      return;
    }

    setDownloading(true);
    toast.loading("Generating invoice PDF...", { id: "invoice" });

    setTimeout(() => {
      const result = generateInvoicePDF(booking);

      if (result.success) {
        toast.success(`Invoice downloaded successfully! 📄`, {
          id: "invoice",
          duration: 4000,
        });
      } else {
        toast.error("Failed to generate invoice: " + result.error, { id: "invoice" });
      }
      setDownloading(false);
    }, 500);
  };

  if (isLoading && !booking) {
    return (
      <div className="min-h-screen flex-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-secondary-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <Link to="/my-bookings" className="btn-primary mt-4">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const vehicle = booking.vehicle || {};
  const owner = booking.owner || {};
  const customer = booking.customer || {};
  const location = booking.location || {};
  const vehicleImage = vehicle.images?.[0]?.url
    ? getImageUrl(vehicle.images[0].url)
    : getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model);

  const getTimelineSteps = () => {
    const isCompleted = booking.status === "completed";
    const isCancelled = ["cancelled", "rejected"].includes(booking.status);
    const isActive = booking.status === "active";
    const isApproved = booking.status === "approved" || isActive || isCompleted;
    const isPending = booking.status === "pending";

    return [
      {
        icon: FileText,
        title: "Booking Placed",
        desc: "Your booking request has been submitted",
        time: booking.createdAt,
        status: "completed",
        color: "bg-green-500",
      },
      {
        icon: CreditCard,
        title: "Payment Received",
        desc: `₹${booking.totalAmount?.toLocaleString()} paid successfully`,
        time: booking.createdAt,
        status: "completed",
        color: "bg-green-500",
      },
      {
        icon: Clock,
        title: "Awaiting Owner Approval",
        desc: isPending
          ? "Owner will review your booking soon"
          : isCancelled && booking.status === "rejected"
          ? "Booking was rejected by owner"
          : "Booking approved by owner",
        time: booking.approvedAt || booking.createdAt,
        status: isPending
          ? "current"
          : isCancelled && booking.status === "rejected"
          ? "failed"
          : "completed",
        color: isPending
          ? "bg-yellow-500"
          : booking.status === "rejected"
          ? "bg-red-500"
          : "bg-green-500",
      },
      {
        icon: PackageCheck,
        title: "Approved & Confirmed",
        desc: isApproved
          ? "Ready for pickup on scheduled date"
          : "Waiting for approval",
        time: booking.approvedAt,
        status: isApproved ? "completed" : isCancelled ? "cancelled" : "pending",
        color: isApproved ? "bg-blue-500" : "bg-gray-300",
      },
      {
        icon: Truck,
        title: "Vehicle Pickup",
        desc: isActive || isCompleted
          ? "Vehicle picked up successfully"
          : `Scheduled: ${formatDate(booking.startDate)}`,
        time: isActive || isCompleted ? booking.startDate : null,
        status: isActive
          ? "current"
          : isCompleted
          ? "completed"
          : isCancelled
          ? "cancelled"
          : "pending",
        color: isActive ? "bg-purple-500" : isCompleted ? "bg-green-500" : "bg-gray-300",
      },
      {
        icon: Home,
        title: "Return Vehicle",
        desc: isCompleted
          ? "Vehicle returned successfully"
          : `Scheduled: ${formatDate(booking.endDate)}`,
        time: isCompleted ? booking.completedAt : null,
        status: isCompleted ? "completed" : isCancelled ? "cancelled" : "pending",
        color: isCompleted ? "bg-green-500" : "bg-gray-300",
      },
      {
        icon: Award,
        title: "Trip Completed",
        desc: isCompleted
          ? "Thank you for choosing RentiGo! Rate your experience"
          : "Complete your trip to unlock this",
        time: booking.completedAt,
        status: isCompleted ? "completed" : isCancelled ? "cancelled" : "pending",
        color: isCompleted ? "bg-green-500" : "bg-gray-300",
      },
    ];
  };

  const timelineSteps = getTimelineSteps();

  const statusConfig = {
    pending: {
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgLight: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: Clock,
      label: "Pending Approval",
      desc: "Waiting for owner to approve your booking",
    },
    approved: {
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: CheckCircle2,
      label: "Booking Approved",
      desc: "Get ready for your pickup!",
    },
    active: {
      color: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
      borderColor: "border-green-200",
      icon: Car,
      label: "Trip Active",
      desc: "Enjoy your ride! Return by scheduled date",
    },
    completed: {
      color: "bg-gray-500",
      textColor: "text-gray-700",
      bgLight: "bg-gray-50",
      borderColor: "border-gray-200",
      icon: Award,
      label: "Trip Completed",
      desc: "Thank you for using RentiGo!",
    },
    rejected: {
      color: "bg-red-500",
      textColor: "text-red-700",
      bgLight: "bg-red-50",
      borderColor: "border-red-200",
      icon: XCircle,
      label: "Booking Rejected",
      desc: booking.rejectionReason || "Owner rejected this booking",
    },
    cancelled: {
      color: "bg-red-500",
      textColor: "text-red-700",
      bgLight: "bg-red-50",
      borderColor: "border-red-200",
      icon: XCircle,
      label: "Cancelled",
      desc: booking.cancellationReason || "Booking was cancelled",
    },
  };

  const currentStatus = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;
  const canCancel = ["pending", "approved"].includes(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-lg">Track Booking</h1>
                <p className="text-xs text-secondary-500 font-mono">
                  #{booking.bookingId || booking._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {autoRefresh && !["completed", "cancelled", "rejected"].includes(booking.status) && (
                <span className="hidden md:flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live tracking
                </span>
              )}
              <button
                onClick={() => loadBooking()}
                disabled={refreshing}
                className="btn-outline btn-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-6">

        {/* STATUS BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card p-6 mb-6 border-l-4 ${currentStatus.borderColor} ${currentStatus.bgLight}`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 ${currentStatus.color} rounded-2xl flex-center shadow-lg flex-shrink-0`}>
              <StatusIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl md:text-2xl font-bold ${currentStatus.textColor} mb-1`}>
                {currentStatus.label}
              </h2>
              <p className="text-secondary-600 text-sm">{currentStatus.desc}</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${currentStatus.color} transition-all duration-1000`}
                    style={{
                      width:
                        booking.status === "pending" ? "25%" :
                        booking.status === "approved" ? "50%" :
                        booking.status === "active" ? "75%" :
                        booking.status === "completed" ? "100%" :
                        "100%"
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-secondary-600">
                  {booking.status === "pending" ? "25%" :
                   booking.status === "approved" ? "50%" :
                   booking.status === "active" ? "75%" :
                   "100%"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: TIMELINE + DETAILS */}
          <div className="lg:col-span-2 space-y-6">

            {/* TIMELINE */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-lg">Booking Journey</h3>
              </div>

              <div className="relative">
                {timelineSteps.map((step, i) => {
                  const isLast = i === timelineSteps.length - 1;
                  const StepIcon = step.icon;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 pb-6 relative"
                    >
                      {!isLast && (
                        <div
                          className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                            step.status === "completed" ? "bg-green-500" :
                            step.status === "current" ? "bg-yellow-500" :
                            step.status === "failed" ? "bg-red-500" :
                            "bg-gray-200"
                          }`}
                        />
                      )}

                      <div className={`relative z-10 w-12 h-12 rounded-full flex-center flex-shrink-0 shadow-lg ${
                        step.status === "completed" ? step.color :
                        step.status === "current" ? `${step.color} animate-pulse` :
                        step.status === "failed" ? "bg-red-500" :
                        step.status === "cancelled" ? "bg-gray-300" :
                        "bg-gray-200"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : step.status === "failed" ? (
                          <XCircle className="w-6 h-6 text-white" />
                        ) : (
                          <StepIcon className={`w-6 h-6 ${
                            step.status === "current" ? "text-white" :
                            step.status === "cancelled" ? "text-gray-500" :
                            "text-gray-400"
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 pt-1.5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-bold ${
                            step.status === "completed" ? "text-secondary-900" :
                            step.status === "current" ? "text-primary-600" :
                            step.status === "failed" ? "text-red-600" :
                            "text-secondary-400"
                          }`}>
                            {step.title}
                          </h4>
                          {step.status === "current" && (
                            <span className="text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                              IN PROGRESS
                            </span>
                          )}
                          {step.status === "completed" && (
                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                              ✓ DONE
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          step.status === "completed" || step.status === "current"
                            ? "text-secondary-600"
                            : "text-secondary-400"
                        }`}>
                          {step.desc}
                        </p>
                        {step.time && step.status !== "pending" && (
                          <p className="text-xs text-secondary-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(step.time)}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* VEHICLE DETAILS */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary-600" />
                Vehicle Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 aspect-square bg-white border border-gray-200 rounded-xl p-4 flex-center">
                  <img
                    src={vehicleImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model);
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold mb-1">
                    {vehicle.brand} {vehicle.model}
                  </h4>
                  <p className="text-sm text-secondary-500 mb-3 font-mono">
                    {vehicle.vehicleNumber}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <p className="text-[10px] text-secondary-500 uppercase font-bold">Type</p>
                      <p className="text-sm font-semibold mt-0.5">
                        {vehicle.type === "2W" ? "🏍️ Two Wheeler" : "🚗 Four Wheeler"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <p className="text-[10px] text-secondary-500 uppercase font-bold">Fuel</p>
                      <p className="text-sm font-semibold mt-0.5 capitalize">{vehicle.fuelType}</p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <p className="text-[10px] text-secondary-500 uppercase font-bold">Transmission</p>
                      <p className="text-sm font-semibold mt-0.5 capitalize">{vehicle.transmission}</p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <p className="text-[10px] text-secondary-500 uppercase font-bold">Year</p>
                      <p className="text-sm font-semibold mt-0.5">{vehicle.modelYear}</p>
                    </div>
                  </div>

                  <Link
                    to={`/vehicles/${vehicle._id}`}
                    className="btn-outline btn-sm mt-3 inline-flex"
                  >
                    View Full Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* TRIP DETAILS */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Trip Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-primary-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <p className="text-xs uppercase font-bold text-blue-700">Pickup</p>
                  </div>
                  <p className="text-lg font-bold">{formatDate(booking.startDate)}</p>
                  <p className="text-xs text-secondary-600 mt-1">10:00 AM onwards</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-5 h-5 text-green-600" />
                    <p className="text-xs uppercase font-bold text-green-700">Return</p>
                  </div>
                  <p className="text-lg font-bold">{formatDate(booking.endDate)}</p>
                  <p className="text-xs text-secondary-600 mt-1">Before 08:00 PM</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs uppercase font-bold text-secondary-500 mb-1">Duration</p>
                  <p className="text-lg font-bold capitalize">
                    {booking.totalDays} days ({booking.durationType})
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs uppercase font-bold text-secondary-500 mb-1">Location</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    {location.city || "N/A"}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">{location.name}</p>
                </div>
              </div>

              {booking.customerNotes && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-xl">
                  <p className="text-xs font-bold text-yellow-700 mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Special Instructions
                  </p>
                  <p className="text-sm text-secondary-700">{booking.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1 space-y-4">

            {/* PAYMENT DETAILS */}
            <div className="card p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                Payment Details
              </h3>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Base Amount</span>
                  <span className="font-semibold">
                    ₹{(booking.pricePerUnit * booking.totalDays)?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Service Fee</span>
                  <span className="font-semibold">
                    ₹{Math.round((booking.pricePerUnit * booking.totalDays) * 0.05)?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">GST (18%)</span>
                  <span className="font-semibold">
                    ₹{Math.round((booking.pricePerUnit * booking.totalDays) * 0.18)?.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold">Total Paid</span>
                    <span className="text-2xl font-bold gradient-text">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-3 rounded-xl mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-bold text-green-700">Payment Confirmed</p>
                </div>
                <p className="text-[10px] text-secondary-600 mt-1">
                  Transaction: TXN{booking._id?.slice(-10).toUpperCase()}
                </p>
              </div>

              {/* 🔥 DOWNLOAD INVOICE BUTTON */}
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Invoice PDF
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-secondary-400 mt-2">
                📄 Official RentiGo invoice with GST details
              </p>
            </div>

            {/* OWNER CONTACT */}
            {(booking.status === "approved" || booking.status === "active") && owner && (
              <div className="card p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Owner Contact
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 gradient-bg rounded-full flex-center text-white font-bold text-lg">
                    {owner.name?.charAt(0) || "O"}
                  </div>
                  <div>
                    <p className="font-bold">{owner.name || "Owner"}</p>
                    <p className="text-xs text-secondary-500">
                      {owner.businessName || "Vehicle Owner"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {owner.phone && (
                    <a href={`tel:${owner.phone}`} className="btn-primary w-full btn-sm">
                      <Phone className="w-4 h-4" />
                      Call Owner
                    </a>
                  )}
                  {owner.phone && (
                    <a
                      href={`https://wa.me/91${owner.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full btn-sm bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* HELP */}
            <div className="card p-5">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary-600" />
                Need Help?
              </h3>

              <div className="space-y-2 text-sm">
                <a href="tel:+918000000000" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-semibold text-xs">24/7 Support</p>
                    <p className="text-xs text-secondary-500">+91 80000 00000</p>
                  </div>
                </a>
                <a href="mailto:support@rentigo.com" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="font-semibold text-xs">Email Us</p>
                    <p className="text-xs text-secondary-500">support@rentigo.com</p>
                  </div>
                </a>
                <Link to="/contact" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold text-xs">Live Chat</p>
                    <p className="text-xs text-secondary-500">Chat with us</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* CANCEL BOOKING */}
            {canCancel && (
              <div className="card p-5 border-2 border-red-100">
                <h3 className="font-bold text-lg mb-3 text-red-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cancel Booking
                </h3>
                <p className="text-xs text-secondary-600 mb-3">
                  You can cancel this booking for a full refund up to 24 hours before pickup.
                </p>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn-outline w-full btn-sm bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                >
                  Cancel Booking
                </button>
              </div>
            )}

            {/* RATE TRIP */}
            {booking.status === "completed" && !booking.isReviewed && (
              <div className="card p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Rate Your Experience
                </h3>
                <p className="text-xs text-secondary-600 mb-3">
                  Help others by sharing your experience
                </p>
                <button className="btn-primary w-full btn-sm">
                  <Star className="w-4 h-4" />
                  Write Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CANCEL MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6"
            >
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex-center mx-auto mb-4">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Cancel Booking?</h3>
              <p className="text-sm text-secondary-600 text-center mb-4">
                Are you sure you want to cancel this booking? Refund will be processed within 5-7 business days.
              </p>

              <div className="mb-4">
                <label className="label">Reason for Cancellation *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input mb-2"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Change of plans">Change of plans</option>
                  <option value="Found better price">Found better price</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Vehicle no longer needed">Vehicle no longer needed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="btn-outline flex-1">
                  Keep Booking
                </button>
                <button onClick={handleCancel} className="btn-primary flex-1 bg-red-500 hover:bg-red-600">
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingTrackPage;