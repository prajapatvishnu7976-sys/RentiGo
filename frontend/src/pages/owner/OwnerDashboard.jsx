import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car, Calendar, TrendingUp, DollarSign,
  Plus, ArrowRight, AlertCircle,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import useBookingStore from "../../store/bookingStore";
import StatsCard from "../../components/dashboard/StatsCard";
import Loader from "../../components/common/Loader";
import { StatusBadge } from "../../components/common/Badge";
import { formatPrice, formatRelativeTime, getImageUrl } from "../../utils/helpers";
import { getVehicleFallback } from "../../utils/vehicleImages";

const OwnerDashboard = () => {
  const { myVehicles, fetchMyVehicles } = useVehicleStore();
  const { ownerBookings, fetchOwnerBookings } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchMyVehicles({ limit: 200 }),
        fetchOwnerBookings({ limit: 10 }),
      ]);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading dashboard..." />;

  const vehiclesArray = Array.isArray(myVehicles) ? myVehicles : [];
  const bookingsArray = Array.isArray(ownerBookings) ? ownerBookings : [];

  // Calculate stats
  const totalVehicles = vehiclesArray.length;
  const availableVehicles = vehiclesArray.filter((v) => v.status === "available").length;
  const bookedVehicles = vehiclesArray.filter((v) => v.status === "booked").length;
  const pendingBookings = bookingsArray.filter((b) => b.status === "pending").length;
  const activeBookings = bookingsArray.filter((b) => b.status === "active").length;

  // Calculate total revenue from vehicles
  const totalRevenue = vehiclesArray.reduce((sum, v) => sum + (v.totalRevenue || 0), 0);
  const totalBookings = vehiclesArray.reduce((sum, v) => sum + (v.totalBookings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Owner Dashboard 👋</h1>
          <p className="page-subtitle">
            Manage your fleet and track performance
          </p>
        </div>
        <Link to="/owner/vehicles/add" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Vehicles"
          value={totalVehicles}
          subtitle={`${availableVehicles} available • ${bookedVehicles} booked`}
          icon={Car}
          color="primary"
        />
        <StatsCard
          title="Pending Bookings"
          value={pendingBookings}
          subtitle="Awaiting your approval"
          icon={Calendar}
          color="warning"
        />
        <StatsCard
          title="Active Rentals"
          value={activeBookings}
          subtitle="Currently on rent"
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtitle={`${totalBookings} completed bookings`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card p-6">
          <div className="flex-between mb-4">
            <h3 className="font-semibold text-lg">Recent Bookings</h3>
            <Link
              to="/owner/bookings"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookingsArray.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookingsArray.slice(0, 5).map((b) => {
                const vehicleImage = b.vehicle?.images?.[0]?.url
                  ? getImageUrl(b.vehicle.images[0].url)
                  : getVehicleFallback(b.vehicle?.type, b.vehicle?.brand, b.vehicle?.model);

                return (
                  <Link
                    key={b._id}
                    to={`/my-bookings`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex-center flex-shrink-0 overflow-hidden">
                      <img
                        src={vehicleImage}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.src = getVehicleFallback(b.vehicle?.type, b.vehicle?.brand, b.vehicle?.model);
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {b.customer?.name} • {formatRelativeTime(b.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} size="sm" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Fleet Overview */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Fleet Overview</h3>

          {vehiclesArray.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-3" />
              <p className="text-secondary-600 mb-4">
                You haven't added any vehicles yet
              </p>
              <Link to="/owner/vehicles/add" className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Your First Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  label: "Available",
                  count: vehiclesArray.filter((v) => v.status === "available").length,
                  color: "bg-success-500",
                },
                {
                  label: "Booked",
                  count: vehiclesArray.filter((v) => v.status === "booked").length,
                  color: "bg-primary-500",
                },
                {
                  label: "Maintenance",
                  count: vehiclesArray.filter((v) => v.status === "maintenance").length,
                  color: "bg-warning-500",
                },
                {
                  label: "Pending Approval",
                  count: vehiclesArray.filter((v) => v.listingStatus === "pending").length,
                  color: "bg-blue-500",
                },
                {
                  label: "Rejected",
                  count: vehiclesArray.filter((v) => v.listingStatus === "rejected").length,
                  color: "bg-danger-500",
                },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-2 h-12 rounded-full ${s.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.label}</p>
                  </div>
                  <span className="text-2xl font-bold text-secondary-800">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Vehicles Preview */}
      {vehiclesArray.length > 0 && (
        <div className="card p-6">
          <div className="flex-between mb-4">
            <h3 className="font-semibold text-lg">Your Top Vehicles</h3>
            <Link
              to="/owner/vehicles"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {vehiclesArray.slice(0, 6).map((v) => {
              const vehicleImage = v.images?.[0]?.url
                ? getImageUrl(v.images[0].url)
                : getVehicleFallback(v.type, v.brand, v.model);

              return (
                <Link
                  key={v._id}
                  to={`/owner/vehicles/edit/${v._id}`}
                  className="text-center group"
                >
                  <div className="aspect-square bg-white border border-gray-200 rounded-xl p-3 mb-2 hover:shadow-lg transition-shadow flex items-center justify-center">
                    <img
                      src={vehicleImage}
                      alt={v.brand}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.src = getVehicleFallback(v.type, v.brand, v.model);
                      }}
                    />
                  </div>
                  <p className="text-xs font-semibold truncate">{v.brand}</p>
                  <p className="text-[10px] text-secondary-500 truncate">{v.model}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;