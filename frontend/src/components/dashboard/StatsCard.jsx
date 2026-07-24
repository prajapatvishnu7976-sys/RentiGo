import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend = null,
  trendValue,
  color = "primary",
  subtitle,
}) => {
  const colors = {
    primary: { bg: "bg-primary-50",   text: "text-primary-600",   iconBg: "bg-primary-500"   },
    success: { bg: "bg-success-50",   text: "text-success-600",   iconBg: "bg-success-500"   },
    warning: { bg: "bg-warning-50",   text: "text-warning-600",   iconBg: "bg-warning-500"   },
    danger:  { bg: "bg-danger-50",    text: "text-danger-500",    iconBg: "bg-danger-500"    },
    info:    { bg: "bg-blue-50",      text: "text-blue-600",      iconBg: "bg-blue-500"      },
    purple:  { bg: "bg-purple-50",    text: "text-purple-600",    iconBg: "bg-purple-500"    },
  };

  const config = colors[color];

  return (
    <div className="card p-5 hover:shadow-hover transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex-center shadow-md`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>

        {trend && trendValue !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-success-50 text-success-600"
                : "bg-danger-50 text-danger-500"
            }`}
          >
            {trend === "up" ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {trendValue}%
          </span>
        )}
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-1">
        {value}
      </h3>
      <p className="text-sm text-secondary-600">{title}</p>
      {subtitle && (
        <p className="text-xs text-secondary-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;