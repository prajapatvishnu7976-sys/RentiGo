import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Fuel, Settings, Users,
  Calendar, Shield, CheckCircle2, Heart, Share2,
  Phone, MessageCircle, ChevronLeft, ChevronRight,
  Award, Clock, Zap, Car, Bike, ArrowRight, Info,
  ThumbsUp, AlertCircle, Loader2,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import useAuth from "../../hooks/useAuth";
import { getImageUrl, formatPrice } from "../../utils/helpers";
import { formatFuelType, formatTransmission } from "../../utils/formatters";
import { getVehicleFallback, VEHICLE_IMAGES } from "../../utils/vehicleImages";
import toast from "react-hot-toast";

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { currentVehicle, fetchVehicleById, isLoading, error } = useVehicleStore();

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [durationType, setDurationType] = useState("daily");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    if (id) {
      fetchVehicleById(id);
    }
  }, [id]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-app">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-secondary-600">Loading vehicle details...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error || !currentVehicle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-app">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
            <p className="text-secondary-500 mb-6">
              {error || "The vehicle you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => navigate(-1)} className="btn-outline">
                Go Back
              </button>
              <Link to="/vehicles" className="btn-primary">
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    _id, brand, model, modelYear, type, fuelType,
    transmission, seatingCapacity, pricing, images,
    location, averageRating, totalReviews, status,
    description, features, category, vehicleNumber,
    owner,
  } = currentVehicle;

  // ── Smart Image Logic ─────────────────────────
  const getImagesList = () => {
    if (images && images.length > 0) {
      return images.map((img) => getImageUrl(img.url));
    }
    return [getVehicleFallback(type, brand, model, category)];
  };

  const vehicleImages = getImagesList();
  const istwowheeler = type === "2W";
  const priceLabels = { daily: "/day", weekly: "/week", monthly: "/month" };

  const calculateTotal = () => {
    if (!pickupDate || !returnDate) return 0;
    const days = Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
    );
    if (days <= 0) return 0;
    return days * (pricing?.[durationType] || 0);
  };

  // ═══════════════════════════════════════════════
  // 🔥 BOOK NOW HANDLER (FIXED)
  // ═══════════════════════════════════════════════
  const handleBookNow = () => {
    // Validate dates first
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be after pickup date");
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to book this vehicle", { duration: 3000 });

      // Save booking intent in sessionStorage
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          vehicleId: _id,
          pickupDate,
          returnDate,
          durationType,
        })
      );

      // Redirect to login with return URL
      navigate(`/login?redirect=/book/${_id}?pickup=${pickupDate}&return=${returnDate}&type=${durationType}`);
      return;
    }

    // Check user role
    if (user?.role !== "customer") {
      toast.error("Only customers can book vehicles. Please use a customer account.");
      return;
    }

    // Navigate to booking page
    navigate(`/book/${_id}?pickup=${pickupDate}&return=${returnDate}&type=${durationType}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${brand} ${model}`,
        text: `Check out this ${brand} ${model} on RentiGo!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const TypeIcon = istwowheeler ? Bike : Car;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-app py-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-secondary-600 hover:text-primary-600">Home</Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <Link to="/vehicles" className="text-secondary-600 hover:text-primary-600">Vehicles</Link>
            <ChevronRight className="w-4 h-4 text-secondary-400" />
            <span className="text-primary-600 font-semibold">{brand} {model}</span>
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vehicles
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Images + Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card overflow-hidden"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={vehicleImages[activeImage]}
                  alt={`${brand} ${model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getVehicleFallback(type, brand, model, category);
                  }}
                />

                {vehicleImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => (p === 0 ? vehicleImages.length - 1 : p - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => (p + 1) % vehicleImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                      istwowheeler ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                    }`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {istwowheeler ? "Two Wheeler" : "Four Wheeler"}
                    </span>
                    {status === "available" && (
                      <span className="bg-success-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                        ✓ Available
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`w-10 h-10 rounded-full flex-center shadow-md transition-all ${
                        liked ? "bg-red-500 text-white" : "bg-white/90 text-secondary-600 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? "fill-white" : ""}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 bg-white/90 rounded-full flex-center shadow-md text-secondary-600 hover:text-primary-600"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {vehicleImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {activeImage + 1} / {vehicleImages.length}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {vehicleImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {vehicleImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = getVehicleFallback(type, brand, model, category); }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 font-heading">
                    {brand} {model}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {modelYear} Model
                    </span>
                    {vehicleNumber && (
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">
                        {vehicleNumber}
                      </span>
                    )}
                  </div>
                </div>

                {averageRating > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <div>
                      <span className="font-bold">{Number(averageRating).toFixed(1)}</span>
                      <span className="text-xs text-secondary-500 ml-1">({totalReviews})</span>
                    </div>
                  </div>
                )}
              </div>

              {location && (
                <div className="flex items-center gap-2 text-secondary-600 pb-4 border-b border-gray-100 mb-4">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{location.name}, {location.city}, {location.state}</span>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Fuel, label: "Fuel", value: formatFuelType(fuelType), color: "bg-orange-50 text-orange-600" },
                  { icon: Settings, label: "Transmission", value: formatTransmission(transmission), color: "bg-blue-50 text-blue-600" },
                  { icon: Users, label: "Seats", value: `${seatingCapacity}`, color: "bg-green-50 text-green-600" },
                  { icon: Calendar, label: "Year", value: modelYear, color: "bg-purple-50 text-purple-600" },
                ].map((spec, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 ${spec.color} rounded-lg flex-center mx-auto mb-2`}>
                      <spec.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-secondary-500 mb-1">{spec.label}</p>
                    <p className="font-bold text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            {description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary-600" />
                  About this Vehicle
                </h3>
                <p className="text-secondary-600 leading-relaxed">{description}</p>
              </motion.div>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Key Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* What's Included */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                What's Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: Shield, text: "Comprehensive Insurance Coverage" },
                  { icon: Clock, text: "24/7 Roadside Assistance" },
                  { icon: CheckCircle2, text: "Free Cancellation (24h prior)" },
                  { icon: Zap, text: "Instant Booking Confirmation" },
                  { icon: Award, text: "Quality Checked Vehicle" },
                  { icon: ThumbsUp, text: "No Hidden Charges" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-50 rounded-lg flex-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-success-600" />
                    </div>
                    <span className="text-sm text-secondary-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Important Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border-l-4 border-yellow-400">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-700">
                <AlertCircle className="w-5 h-5" />
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li>• Valid driving license required at pickup</li>
                <li>• Original ID proof (Aadhaar/PAN) mandatory</li>
                <li>• Security deposit will be collected</li>
                <li>• Fuel charges as per actual consumption</li>
                <li>• Late return charges: ₹150/hour after grace period</li>
              </ul>
            </motion.div>
          </div>

          {/* RIGHT: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 shadow-xl border-2 border-primary-100">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-secondary-500 uppercase font-bold tracking-wider mb-1">
                    Starting From
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold gradient-text">
                      {formatPrice(pricing?.[durationType])}
                    </span>
                    <span className="text-secondary-500">{priceLabels[durationType]}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label">Rental Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["daily", "weekly", "monthly"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDurationType(d)}
                        className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                          durationType === d ? "bg-primary-500 text-white shadow-md" : "bg-gray-50 text-secondary-600 hover:bg-gray-100"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="label">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                {pickupDate && returnDate && calculateTotal() > 0 && (
                  <div className="bg-gradient-to-br from-primary-50 to-orange-50 p-4 rounded-xl mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary-600">Rental Charge:</span>
                      <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-secondary-600">Service Fee:</span>
                      <span className="font-semibold">₹{Math.round(calculateTotal() * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-primary-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg gradient-text">
                          ₹{Math.round(calculateTotal() * 1.05).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  disabled={status !== "available"}
                  className="btn-primary btn-lg w-full mb-3 disabled:opacity-50"
                >
                  {status === "available" ? (
                    <>
                      {isAuthenticated ? "Book Now" : "Login to Book"}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Currently Unavailable"
                  )}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-secondary-500 mb-3">
                    New here?{" "}
                    <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                      Sign up free
                    </Link>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:+918000000000" className="btn-outline btn-sm">
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a href="https://wa.me/918000000000" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </motion.div>

              {/* Owner Info */}
              {owner && (
                <div className="card p-4">
                  <h4 className="font-bold mb-3 text-sm">Listed by</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-bg rounded-full flex-center text-white font-bold">
                      {owner.name?.charAt(0) || "O"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{owner.businessName || owner.name || "Verified Owner"}</p>
                      <p className="text-xs text-secondary-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success-500" />
                        Verified Partner
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="card p-4">
                <h4 className="font-bold mb-3 text-sm">Why Book with Us</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { icon: Shield, text: "100% Secure Payment" },
                    { icon: Clock, text: "24/7 Customer Support" },
                    { icon: Award, text: "Best Price Guarantee" },
                    { icon: CheckCircle2, text: "Free Cancellation" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-secondary-600">
                      <b.icon className="w-4 h-4 text-primary-500" />
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;