import React, { useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import Loader from "../../components/common/Loader";
import { formatPrice } from "../../utils/helpers";

const ManagePricing = () => {
  const { pricingOverview, fetchPricingOverview } = useAdminStore();

  useEffect(() => {
    fetchPricingOverview();
  }, []);

  if (!pricingOverview) return <Loader fullScreen text="Loading pricing data..." />;

  const stats = pricingOverview.pricingStats || [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pricing Overview 💰</h1>
          <p className="page-subtitle">
            Platform-wide pricing analytics by vehicle type
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((s) => (
          <div key={s._id} className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex-center text-3xl ${
                s._id === "2W" ? "type-2w" : "type-4w"
              }`}>
                {s._id === "2W" ? "🛵" : "🚗"}
              </div>
              <div>
                <h3 className="font-bold text-xl">
                  {s._id === "2W" ? "Two Wheelers" : "Four Wheelers"}
                </h3>
                <p className="text-sm text-secondary-500">
                  {s.totalVehicles} vehicles
                </p>
              </div>
            </div>

            {/* Average Prices */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-secondary-700 uppercase tracking-wider">
                Average Prices
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-primary-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-primary-600 mb-1">Daily</p>
                  <p className="font-bold text-primary-700">
                    {formatPrice(Math.round(s.avgDailyPrice))}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-blue-600 mb-1">Weekly</p>
                  <p className="font-bold text-blue-700">
                    {formatPrice(Math.round(s.avgWeeklyPrice))}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-purple-600 mb-1">Monthly</p>
                  <p className="font-bold text-purple-700">
                    {formatPrice(Math.round(s.avgMonthlyPrice))}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-sm text-secondary-700 uppercase tracking-wider">
                Daily Price Range
              </h4>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs text-secondary-500">Minimum</p>
                  <p className="font-bold text-success-600">
                    {formatPrice(s.minDailyPrice)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-secondary-300" />
                <div className="text-right">
                  <p className="text-xs text-secondary-500">Maximum</p>
                  <p className="font-bold text-danger-500">
                    {formatPrice(s.maxDailyPrice)}
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                <div className="h-full gradient-bg rounded-full w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="card p-12 text-center">
          <DollarSign className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No pricing data available yet</p>
        </div>
      )}
    </div>
  );
};

export default ManagePricing;