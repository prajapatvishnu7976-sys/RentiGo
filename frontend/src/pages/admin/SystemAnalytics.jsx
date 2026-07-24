import React, { useEffect, useState } from "react";
import {
  TrendingUp, DollarSign, Calendar, Users, Car,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";
import StatsCard from "../../components/dashboard/StatsCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Loader from "../../components/common/Loader";
import { formatPrice, getImageUrl, getInitials } from "../../utils/helpers";

const SystemAnalytics = () => {
  const {
    revenueAnalytics, bookingAnalytics, fleetAnalytics, userAnalytics,
    fetchRevenueAnalytics, fetchBookingAnalytics, fetchFleetAnalytics, fetchUserAnalytics,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchRevenueAnalytics(),
        fetchBookingAnalytics(),
        fetchFleetAnalytics(),
        fetchUserAnalytics(),
      ]);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading analytics..." />;

  const totalRevenue = revenueAnalytics?.summary?.totalRevenue || 0;
  const totalBookings = revenueAnalytics?.summary?.totalBookings || 0;
  const avgBooking = revenueAnalytics?.summary?.avgBookingValue || 0;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Analytics 📊</h1>
          <p className="page-subtitle">
            Comprehensive insights across the entire platform
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Platform Revenue"
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
          title="Avg Order Value"
          value={formatPrice(avgBooking)}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Active Users"
          value={userAnalytics?.userGrowth?.[0]?.newUsers || 0}
          subtitle="This month"
          icon={Users}
          color="info"
        />
      </div>

      {/* Revenue Trends */}
      {revenueAnalytics?.yearlyData && (
        <RevenueChart
          data={revenueAnalytics.yearlyData}
          title="Yearly Revenue Trend"
          type="line"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Type */}
        {revenueAnalytics?.revenueByType && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Revenue by Vehicle Type</h3>
            <div className="space-y-4">
              {revenueAnalytics.revenueByType.map((rt) => (
                <div key={rt._id}>
                  <div className="flex-between mb-2">
                    <span className="font-medium text-sm">
                      {rt._id === "2W" ? "🛵 Two Wheelers" : "🚗 Four Wheelers"}
                    </span>
                    <span className="font-bold gradient-text">
                      {formatPrice(rt.revenue)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-bg"
                      style={{
                        width: `${(rt.revenue / totalRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    {rt.bookings} bookings
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue by Duration */}
        {revenueAnalytics?.revenueByDuration && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Revenue by Duration Type</h3>
            <div className="space-y-4">
              {revenueAnalytics.revenueByDuration.map((rd) => (
                <div key={rd._id}>
                  <div className="flex-between mb-2">
                    <span className="font-medium text-sm capitalize">
                      {rd._id}
                    </span>
                    <span className="font-bold">
                      {formatPrice(rd.revenue)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(rd.revenue / totalRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    {rd.bookings} bookings
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Customers */}
        {userAnalytics?.topCustomers && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Top Customers</h3>
            <div className="space-y-3">
              {userAnalytics.topCustomers.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                  <span className={`w-8 h-8 rounded-lg flex-center font-bold text-sm ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-100 text-gray-700" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-secondary-100 text-secondary-700"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                    {getInitials(c.customer?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {c.customer?.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {c.totalBookings} bookings • {formatPrice(c.totalSpent)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Owners */}
        {userAnalytics?.topOwners && (
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Top Owners by Revenue</h3>
            <div className="space-y-3">
              {userAnalytics.topOwners.slice(0, 5).map((o, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                  <span className={`w-8 h-8 rounded-lg flex-center font-bold text-sm ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-100 text-gray-700" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-secondary-100 text-secondary-700"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                    {getInitials(o.owner?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {o.owner?.businessName || o.owner?.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {o.totalBookings} bookings • {formatPrice(o.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Vehicles */}
        {bookingAnalytics?.topVehicles && (
          <div className="card p-6 lg:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Top Performing Vehicles</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {bookingAnalytics.topVehicles.slice(0, 5).map((v, i) => (
                <div key={i} className="card p-3 text-center">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 mb-2 overflow-hidden">
                    {v.vehicle?.images?.[0] ? (
                      <img
                        src={getImageUrl(v.vehicle.images[0].url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex-center text-4xl">
                        {v.vehicle?.type === "2W" ? "🛵" : "🚗"}
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm truncate">
                    {v.vehicle?.brand} {v.vehicle?.model}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {v.totalBookings} bookings
                  </p>
                  <p className="font-bold text-sm gradient-text mt-1">
                    {formatPrice(v.totalRevenue)}
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

export default SystemAnalytics;