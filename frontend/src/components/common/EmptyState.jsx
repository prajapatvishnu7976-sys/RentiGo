import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Try changing your filters or check back later",
  action,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-20 h-20 rounded-full bg-gray-100 flex-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-800 mb-2">{title}</h3>
      <p className="text-secondary-500 text-sm max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;