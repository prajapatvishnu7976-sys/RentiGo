import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, IndianRupee, ArrowRight, Car } from "lucide-react";
import {
  formatDate, formatPrice, formatRelativeTime, getImageUrl,
} from "../../utils/helpers";
import { StatusBadge } from "../common/Badge";

const BookingCard = ({ booking, role = "customer" }) => {
  const {
    _id, bookingId, vehicle, customer, owner, location,
    durationType, startDate, endDate, totalDays, totalAmount,
    status, createdAt,
  } = booking;

  const image = vehicle?.images?.[0]?.url
    ? getImageUrl(vehicle.images[0].url)
    : null;

  return (
    <div className="card overflow-hidden hover:shadow-hover transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Vehicle Image */}
        <div className="md:w-48 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={vehicle?.brand}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex-center bg-gradient-to-br from-primary-100 to-primary-200">
              <Car className="w-12 h-12 text-primary-600" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold text-lg text-secondary-900">
                {vehicle?.brand} {vehicle?.model}
              </h3>
              <p className="text-xs text-secondary-500 font-mono mt-0.5">
                #{bookingId}
              </p>
            </div>
            <p className="text-xs text-secondary-500">
              {formatRelativeTime(createdAt)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="text-secondary-500">Duration</p>
                <p className="font-medium text-secondary-800">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
                <p className="text-secondary-500 mt-0.5">
                  {totalDays} days • {durationType}
                </p>
              </div>
            </div>

            {location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="text-secondary-500">Pickup</p>
                  <p className="font-medium text-secondary-800">
                    {location.name}
                  </p>
                  <p className="text-secondary-500 mt-0.5">{location.city}</p>
                </div>
              </div>
            )}
          </div>

          {/* User Info (changes based on role) */}
          {role === "customer" && owner && (
            <div className="flex items-center gap-2 mb-4 text-xs text-secondary-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="w-7 h-7 rounded-full gradient-bg flex-center text-white font-semibold text-[10px]">
                {owner.name?.[0]?.toUpperCase()}
              </span>
              <span>
                <span className="text-secondary-500">Owner:</span>{" "}
                <span className="font-medium">
                  {owner.businessName || owner.name}
                </span>
              </span>
            </div>
          )}

          {(role === "owner" || role === "admin") && customer && (
            <div className="flex items-center gap-2 mb-4 text-xs text-secondary-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="w-7 h-7 rounded-full gradient-bg flex-center text-white font-semibold text-[10px]">
                {customer.name?.[0]?.toUpperCase()}
              </span>
              <span>
                <span className="text-secondary-500">Customer:</span>{" "}
                <span className="font-medium">{customer.name}</span>
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-secondary-500">Total Amount</p>
              <p className="text-lg font-bold gradient-text flex items-center">
                <IndianRupee className="w-4 h-4" />
                {totalAmount?.toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              to={`/bookings/${_id}`}
              className="btn-primary btn-sm group"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;