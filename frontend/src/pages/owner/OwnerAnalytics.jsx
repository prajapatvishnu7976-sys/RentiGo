import React, { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Car, Calendar } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import StatsCard from "../../components/dashboard/StatsCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Loader from "../../components/common/Loader";
import { formatPrice, getImageUrl } from "../../utils/helpers";

const OwnerAnalytics = () => {
  const {
    revenueAnalytics, bookingAnalytics, fleetAnalytics,
    fetchRevenueAnalytics, fetchBookingAnalytics, fetchFleetAnalytics,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchRevenueAnalytics(),
        fetchBookingAnalytics(),
        fetchFleetAnalytics(),
      ]);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading analytics..." />;

  const totalRevenue = revenueAnalytics?.summary?.totalRevenue || 0;
  const totalBookings = revenueAnalytics?.summary?.totalBookings || 0;
  const avgBooking = revenueAnalytics?.summary?.avgBookingValue || 0;
  const totalVehicles = fleetAnalytics?.vehiclesByType?.reduce(
    (sum, t) => sum + t.count, 0
  ) || 0;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics 📊</h1>
          <p className="page-subtitle">Insights into your business performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          color="success"
        />
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon={Calendar}
          color="primary"
        />
        <StatsCard
          title="Avg. Booking Value"
          value={formatPrice(avgBooking)}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Total Vehicles"
          value={totalVehicles}
          icon={Car}
          color="info"
        />
      </div>

      {/* Revenue Chart */}
      {revenueAnalytics?.yearlyData && (
        <RevenueChart
          data={revenueAnalytics.yearlyData}
          title="Monthly Revenue Trend"
          type="line"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Vehicles */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Top Performing Vehicles</h3>
          {fleetAnalytics?.topPerformers && fleetAnalytics.topPerformers.length > 0 ? (
            <div className="space-y-3">
              {fleetAnalytics.topPerformers.slice(0, 5).map((v, i) => (
                <div key={v._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                  <span className={`w-8 h-8 rounded-lg flex-center font-bold text-sm ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-100 text-gray-700" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-secondary-100 text-secondary-700"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex-center flex-shrink-0">
                    {v.images?.[0] ? (
                      <img src={getImageUrl(v.images[0].url)} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Car className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{v.brand} {v.model}</p>
                    <p className="text-xs text-secondary-500">
                      {v.totalBookings} bookings • {formatPrice(v.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-secondary-400">No data yet</p>
          )}
        </div>

        {/* Vehicles by Type */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Fleet Distribution</h3>
          {fleetAnalytics?.vehiclesByType && fleetAnalytics.vehiclesByType.length > 0 ? (
            <div className="space-y-4">
              {fleetAnalytics.vehiclesByType.map((t) => (
                <div key={t._id}>
                  <div className="flex-between mb-2 text-sm">
                    <span className="font-medium">
                      {t._id === "2W" ? "🛵 Two Wheelers" : "🚗 Four Wheelers"}
                    </span>
                    <span className="font-bold">{t.count} vehicles</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-bg"
                      style={{
                        width: `${(t.count / totalVehicles) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    Revenue: {formatPrice(t.totalRevenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-secondary-400">No data yet</p>
          )}
        </div>

        {/* Bookings by Status */}
        {bookingAnalytics?.bookingsByStatus && (
          <div className="card p-6 lg:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Bookings by Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {bookingAnalytics.bookingsByStatus.map((s) => (
                <div key={s._id} className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold gradient-text">{s.count}</p>
                  <p className="text-xs text-secondary-600 capitalize mt-1">
                    {s._id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerAnalytics;