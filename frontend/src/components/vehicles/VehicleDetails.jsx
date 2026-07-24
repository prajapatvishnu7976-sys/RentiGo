import React, { useState } from "react";
import {
  Fuel, Settings, Users, MapPin, Calendar, Star,
  Phone, User, CheckCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { formatPrice, getImageUrl, formatDate } from "../../utils/helpers";
import { formatFuelType, formatTransmission } from "../../utils/formatters";
import { StatusBadge } from "../common/Badge";
import StarRating from "../common/StarRating";

const VehicleDetails = ({ vehicle }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!vehicle) return null;

  const {
    brand, model, modelYear, type, fuelType, transmission,
    seatingCapacity, color, description, features, images,
    pricing, location, owner, status, averageRating, totalReviews,
    totalBookings, vehicleNumber,
  } = vehicle;

  const hasImages = images && images.length > 0;
  const currentImage = hasImages ? getImageUrl(images[activeImage].url) : null;

  const nextImage = () => setActiveImage((p) => (p + 1) % images.length);
  const prevImage = () => setActiveImage((p) => (p === 0 ? images.length - 1 : p - 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - Images & Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Main Image */}
        <div className="card overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
            {hasImages ? (
              <>
                <img
                  src={currentImage}
                  alt={`${brand} ${model}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex-center shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                      {activeImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex-center flex-col bg-gradient-to-br from-primary-100 to-primary-200">
                <div className="text-9xl mb-3">{type === "2W" ? "🛵" : "🚗"}</div>
                <p className="text-primary-700 font-bold text-2xl">{brand}</p>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`badge ${type === "2W" ? "type-2w" : "type-4w"} shadow-md`}>
                {type === "2W" ? "🛵 Two Wheeler" : "🚗 Four Wheeler"}
              </span>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Thumbnails */}
          {hasImages && images.length > 1 && (
            <div className="p-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImage
                      ? "border-primary-500 ring-2 ring-primary-200"
                      : "border-gray-200"
                  }`}
                >
                  <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Rating */}
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-1">
                {brand} {model}
              </h1>
              <div className="flex items-center gap-3 flex-wrap text-sm text-secondary-500">
                <span>{modelYear} Model</span>
                <span>•</span>
                <span className="font-mono">{vehicleNumber}</span>
                {color && (
                  <>
                    <span>•</span>
                    <span>{color}</span>
                  </>
                )}
              </div>
            </div>

            {averageRating > 0 && (
              <div className="text-right">
                <StarRating rating={averageRating} showValue size="md" />
                <p className="text-xs text-secondary-500 mt-1">
                  {totalReviews} reviews
                </p>
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Fuel className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <p className="text-xs text-secondary-500">Fuel</p>
              <p className="font-semibold text-sm">{formatFuelType(fuelType)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Settings className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <p className="text-xs text-secondary-500">Transmission</p>
              <p className="font-semibold text-sm">{formatTransmission(transmission)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <p className="text-xs text-secondary-500">Seats</p>
              <p className="font-semibold text-sm">{seatingCapacity} Persons</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <p className="text-xs text-secondary-500">Bookings</p>
              <p className="font-semibold text-sm">{totalBookings || 0}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-3">About this vehicle</h3>
            <p className="text-secondary-600 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                  <span className="text-sm text-secondary-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Pickup Location
            </h3>
            <p className="font-medium text-secondary-800">{location.name}</p>
            <p className="text-sm text-secondary-600 mt-1">
              {location.address}, {location.city}, {location.state} - {location.pincode}
            </p>
          </div>
        )}

        {/* Owner */}
        {owner && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Listed by</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 gradient-bg rounded-xl flex-center text-white font-bold text-lg">
                {owner.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-secondary-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {owner.name}
                </p>
                {owner.businessName && (
                  <p className="text-sm text-secondary-600">{owner.businessName}</p>
                )}
                <p className="text-sm text-secondary-500 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  +91 {owner.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right - Pricing */}
      <div className="lg:col-span-1">
        <div className="card p-6 sticky top-24">
          <h3 className="font-semibold text-lg mb-4">Rental Pricing</h3>

          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
              <p className="text-xs text-primary-700 font-semibold uppercase tracking-wider mb-1">
                Daily Rate
              </p>
              <p className="text-3xl font-bold gradient-text">
                {formatPrice(pricing?.daily)}
                <span className="text-sm font-normal text-secondary-500">/day</span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-secondary-600 font-semibold uppercase tracking-wider mb-1">
                Weekly Rate
              </p>
              <p className="text-xl font-bold text-secondary-800">
                {formatPrice(pricing?.weekly)}
                <span className="text-sm font-normal text-secondary-500">/week</span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-secondary-600 font-semibold uppercase tracking-wider mb-1">
                Monthly Rate
              </p>
              <p className="text-xl font-bold text-secondary-800">
                {formatPrice(pricing?.monthly)}
                <span className="text-sm font-normal text-secondary-500">/month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;