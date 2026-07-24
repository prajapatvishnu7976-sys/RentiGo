import React from "react";

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
}) => {
  const variants = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    secondary: "badge-secondary",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

// Status Badge - Auto color based on status
export const StatusBadge = ({ status, size = "md" }) => {
  const statusMap = {
    // Booking statuses
    pending:   { variant: "warning",   label: "Pending"   },
    approved:  { variant: "primary",   label: "Approved"  },
    active:    { variant: "success",   label: "Active"    },
    completed: { variant: "secondary", label: "Completed" },
    rejected:  { variant: "danger",    label: "Rejected"  },
    cancelled: { variant: "danger",    label: "Cancelled" },
    // Vehicle statuses
    available:   { variant: "success", label: "Available"   },
    booked:      { variant: "primary", label: "Booked"      },
    maintenance: { variant: "warning", label: "Maintenance" },
    inactive:    { variant: "secondary", label: "Inactive"  },
  };

  const config = statusMap[status] || { variant: "secondary", label: status };

  return (
    <Badge variant={config.variant} size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      {config.label}
    </Badge>
  );
};

export default Badge;