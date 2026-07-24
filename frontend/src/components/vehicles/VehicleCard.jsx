import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Fuel, Settings, Users, MapPin, Star, ArrowRight,
  Eye, Heart, Bike, Car,
} from "lucide-react";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import { formatFuelType, formatTransmission } from "../../utils/formatters";
import { StatusBadge } from "../common/Badge";
import { getVehicleFallback, VEHICLE_IMAGES } from "../../utils/vehicleImages";

const VehicleCard = ({ vehicle, durationType = "daily" }) => {
  const {
    _id, brand, model, modelYear, type, fuelType,
    transmission, seatingCapacity, pricing, images,
    location, averageRating, totalReviews, status,
    category,
  } = vehicle;

  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);

  // ── Smart Image Logic ─────────────────────────
  const getSmartImage = () => {
    // 1. Backend image exists? Use it
    if (images?.[0]?.url && !imageError) {
      return getImageUrl(images[0].url);
    }
    // 2. Get fallback based on brand + model + type + category
    return getVehicleFallback(type, brand, model, category);
  };

  const mainImage = getSmartImage();
  const priceLabels = { daily: "/day", weekly: "/week", monthly: "/month" };

  // Vehicle type icon & label
  const istwowheeler = type === "2W";
  const typeLabel = istwowheeler ? "Two Wheeler" : "Four Wheeler";
  const TypeIcon = istwowheeler ? Bike : Car;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group relative"
    >
      {/* ── Image Section ─────────────────────────── */}
      <Link to={`/vehicles/${_id}`} className="block relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
          <img
            src={mainImage}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              setImageError(true);
              // Set fallback image
              const fallback = getVehicleFallback(type, brand, model, category);
              if (e.target.src !== fallback) {
                e.target.src = fallback;
              } else {
                // Ultimate fallback
                e.target.src = istwowheeler
                  ? VEHICLE_IMAGES.sportsBike
                  : VEHICLE_IMAGES.sedan;
              }
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick View Button (on hover) */}
          <div className="absolute inset-0 flex-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/95 backdrop-blur-sm text-secondary-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${
                istwowheeler
                  ? "bg-blue-500 text-white"
                  : "bg-purple-500 text-white"
              }`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              {typeLabel}
            </span>
            {status && <StatusBadge status={status} size="sm" />}
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex-center transition-all duration-200 shadow-md ${
              liked
                ? "bg-red-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-secondary-500 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-white" : ""}`}
            />
          </button>

          {/* Rating Badge */}
          {averageRating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-secondary-800">
                {Number(averageRating).toFixed(1)}
              </span>
              <span className="text-[10px] text-secondary-500">
                ({totalReviews})
              </span>
            </div>
          )}

          {/* Price Tag on Image */}
          <div className="absolute bottom-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {formatPrice(pricing?.[durationType])}{priceLabels[durationType]}
          </div>
        </div>
      </Link>

      {/* ── Content Section ───────────────────────── */}
      <div className="p-4">
        {/* Title + Year */}
        <div className="mb-3">
          <Link to={`/vehicles/${_id}`}>
            <h3 className="font-bold text-lg text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {brand} {model}
            </h3>
          </Link>
          <p className="text-xs text-secondary-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {modelYear} Model
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex-center">
              <Fuel className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-[11px] text-secondary-600 font-medium text-center">
              {formatFuelType(fuelType)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex-center">
              <Settings className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[11px] text-secondary-600 font-medium text-center">
              {formatTransmission(transmission)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex-center">
              <Users className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-[11px] text-secondary-600 font-medium text-center">
              {seatingCapacity} Seats
            </span>
          </div>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-secondary-500 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary-500" />
            <span className="truncate">
              {location.name || location.city}
              {location.city && location.name ? `, ${location.city}` : ""}
            </span>
          </div>
        )}

        {/* Price + Button */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-secondary-500 uppercase font-semibold tracking-wider">
              Starting from
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold gradient-text">
                {formatPrice(pricing?.[durationType])}
              </span>
              <span className="text-xs text-secondary-500">
                {priceLabels[durationType]}
              </span>
            </div>
          </div>

          <Link
            to={`/vehicles/${_id}`}
            className="btn-primary btn-sm group/btn"
          >
            View
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Missing import fix
const Calendar = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default VehicleCard;