import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Car, Calendar, DollarSign, TrendingUp,
  Clock, AlertCircle, ArrowRight, CheckCircle,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";
import StatsCard from "../../components/dashboard/StatsCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Loader from "../../components/common/Loader";
import { StatusBadge } from "../../components/common/Badge";
import { formatPrice, formatRelativeTime, getInitials } from "../../utils/helpers";

const AdminDashboard = () => {
  const {
    dashboardStats, systemOverview, revenueAnalytics,
    fetchDashboardStats, fetchSystemOverview, fetchRevenueAnalytics,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchSystemOverview(),
        fetchRevenueAnalytics(),
      ]);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading admin dashboard..." />;

  const stats = dashboardStats?.stats || {};
  const kpis = systemOverview?.kpis || {};

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard 👑</h1>
          <p className="page-subtitle">
            Complete overview of RentiGo platform
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.users?.total || 0}
          subtitle={`+${stats.users?.newThisMonth || 0} this month`}
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Total Vehicles"
          value={stats.vehicles?.total || 0}
          subtitle={`${stats.vehicles?.pending || 0} pending approval`}
          icon={Car}
          color="info"
        />
        <StatsCard
          title="Active Bookings"
          value={stats.bookings?.active || 0}
          subtitle={`${stats.bookings?.thisMonth || 0} this month`}
          icon={Calendar}
          color="success"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.revenue?.total || 0)}
          subtitle={`${formatPrice(stats.revenue?.thisMonth || 0)} this month`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {kpis.bookingConversionRate || "0%"}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Conversion Rate</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {kpis.vehicleUtilizationRate || "0%"}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Vehicle Utilization</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {kpis.monthlyActiveUsers || 0}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Monthly Active Users</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {kpis.avgRentalDuration || "0 days"}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Avg Duration</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {stats.users?.owners || 0}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Total Owners</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {kpis.totalCompletedBookings || 0}
          </p>
          <p className="text-xs text-secondary-600 mt-1">Completed</p>
        </div>
      </div>

      {/* Revenue Chart */}
      {revenueAnalytics?.yearlyData && (
        <RevenueChart
          data={revenueAnalytics.yearlyData}
          title="Platform Revenue (Last 12 Months)"
          type="line"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="card p-6">
          <div className="flex-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning-500" />
              Pending Vehicle Approvals
            </h3>
            <Link
              to="/admin/listings"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dashboardStats?.pendingVehicles?.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
              <p className="text-secondary-600">All caught up! No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardStats?.pendingVehicles?.slice(0, 5).map((v) => (
                <div key={v._id} className="flex items-center gap-3 p-3 bg-warning-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-warning-100 flex-center">
                    <Car className="w-5 h-5 text-warning-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-xs text-secondary-500">
                      By {v.owner?.name} • {formatRelativeTime(v.createdAt)}
                    </p>
                  </div>
                  <Link to="/admin/listings" className="btn-primary btn-sm">
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card p-6">
          <div className="flex-between mb-4">
            <h3 className="font-semibold text-lg">Recent Bookings</h3>
            <Link
              to="/admin/bookings"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dashboardStats?.recentBookings?.length === 0 ? (
            <p className="text-center py-8 text-secondary-400">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {dashboardStats?.recentBookings?.slice(0, 5).map((b) => (
                <Link
                  key={b._id}
                  to={`/bookings/${b._id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                    {getInitials(b.customer?.name)}
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
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex-between mb-4">
            <h3 className="font-semibold text-lg">New Users</h3>
            <Link
              to="/admin/users"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dashboardStats?.recentUsers?.length === 0 ? (
            <p className="text-center py-8 text-secondary-400">No users yet</p>
          ) : (
            <div className="space-y-3">
              {dashboardStats?.recentUsers?.slice(0, 5).map((u) => (
                <div key={u._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                    {getInitials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-xs text-secondary-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs text-secondary-500">
                    {formatRelativeTime(u.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Booking Status Overview</h3>
          <div className="space-y-3">
            {[
              { label: "Pending", count: stats.bookings?.pending || 0, color: "bg-warning-500" },
              { label: "Active", count: stats.bookings?.active || 0, color: "bg-success-500" },
              { label: "Completed", count: stats.bookings?.completed || 0, color: "bg-secondary-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2 h-12 rounded-full ${s.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                </div>
                <span className="text-2xl font-bold text-secondary-800">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;