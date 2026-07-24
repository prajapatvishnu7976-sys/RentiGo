import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}) => {
  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const halfFilled = i === Math.floor(rating) && rating % 1 !== 0;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(i + 1)}
              className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
            >
              <Star
                className={`
                  ${sizes[size]}
                  ${filled || halfFilled ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                `}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={`font-medium text-secondary-700 ml-1 ${textSizes[size]}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;