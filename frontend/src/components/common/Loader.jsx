import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ size = "md", text = "Loading...", fullScreen = false }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex-center flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl animate-pulse" />
          <Loader2 className={`${sizes[size]} text-primary-500 animate-spin relative`} />
        </div>
        {text && (
          <p className={`${textSizes[size]} text-secondary-600 font-medium`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-center flex-col gap-3 py-8">
      <Loader2 className={`${sizes[size]} text-primary-500 animate-spin`} />
      {text && (
        <p className={`${textSizes[size]} text-secondary-500`}>{text}</p>
      )}
    </div>
  );
};

export const SkeletonLoader = ({ count = 1, className = "h-32" }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 space-y-3">
          <div className="skeleton h-48" />
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="flex gap-2">
            <div className="skeleton h-8 w-20" />
            <div className="skeleton h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;