import React from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES,
  DURATION_TYPES, SORT_OPTIONS,
} from "../../utils/constants";
import Button from "../common/Button";

const VehicleFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <SlidersHorizontal className="w-5 h-5 text-primary-500" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="label">Vehicle Type</label>
        <div className="grid grid-cols-2 gap-2">
          {VEHICLE_TYPES.map((vt) => (
            <button
              key={vt.value}
              onClick={() =>
                onFilterChange({
                  type: filters.type === vt.value ? "" : vt.value,
                })
              }
              className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                filters.type === vt.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="mr-1">{vt.icon}</span>
              {vt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="label">Rental Duration</label>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {DURATION_TYPES.map((d) => (
            <button
              key={d.value}
              onClick={() => onFilterChange({ durationType: d.value })}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                filters.durationType === d.value
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Price Range (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="input text-sm py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="input text-sm py-2"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="label">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((f) => (
            <button
              key={f.value}
              onClick={() =>
                onFilterChange({
                  fuelType: filters.fuelType === f.value ? "" : f.value,
                })
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                filters.fuelType === f.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="label">Transmission</label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSMISSION_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() =>
                onFilterChange({
                  transmission: filters.transmission === t.value ? "" : t.value,
                })
              }
              className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                filters.transmission === t.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="label">Sort By</label>
        <select
          value={`${filters.sortBy}_${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("_");
            onFilterChange({ sortBy, sortOrder });
          }}
          className="input text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button variant="outline" fullWidth onClick={onReset}>
        Reset All Filters
      </Button>
    </div>
  );
};

export default VehicleFilters;