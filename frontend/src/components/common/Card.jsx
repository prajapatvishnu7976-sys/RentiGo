import React from "react";

const Card = ({
  children,
  hover = false,
  padding = "md",
  className = "",
  onClick,
  ...props
}) => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  };

  return (
    <div
      className={`
        ${hover ? "card-hover" : "card"}
        ${paddings[padding]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && (
          <h3 className="text-lg md:text-xl font-semibold text-secondary-900">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-secondary-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`pt-4 mt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;