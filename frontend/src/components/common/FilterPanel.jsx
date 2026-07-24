import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import Button from "./Button";

const FilterPanel = ({
  isOpen,
  onClose,
  title = "Filters",
  children,
  onApply,
  onReset,
  showApply = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed lg:sticky top-0 right-0 lg:right-auto h-screen lg:h-auto w-80 lg:w-full bg-white lg:bg-transparent z-50 lg:z-auto overflow-y-auto p-6 lg:p-0 shadow-2xl lg:shadow-none">
        <div className="flex-between mb-6 lg:hidden">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {(showApply || onReset) && (
          <div className="flex gap-2 mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
            {onReset && (
              <Button
                variant="outline"
                fullWidth
                icon={RotateCcw}
                onClick={onReset}
              >
                Reset
              </Button>
            )}
            {showApply && (
              <Button variant="primary" fullWidth onClick={onApply}>
                Apply Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterPanel;