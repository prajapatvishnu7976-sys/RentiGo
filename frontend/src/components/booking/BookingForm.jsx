import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, IndianRupee, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../common/Button";
import { DURATION_TYPES } from "../../utils/constants";
import { calculateBookingAmount, formatPrice } from "../../utils/helpers";

const BookingForm = ({ vehicle, onSubmit, isLoading }) => {
  const [durationType, setDurationType] = useState("daily");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [calculation, setCalculation] = useState({ totalDays: 0, amount: 0 });

  useEffect(() => {
    if (startDate && endDate && vehicle?.pricing) {
      const calc = calculateBookingAmount(
        vehicle.pricing,
        durationType,
        startDate,
        endDate
      );
      setCalculation(calc);
    }
  }, [startDate, endDate, durationType, vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    onSubmit({
      vehicleId: vehicle._id,
      durationType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      customerNotes: notes,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Duration Type */}
      <div>
        <label className="label flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Rental Plan
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_TYPES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDurationType(d.value)}
              className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                durationType === d.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {d.label}
              <p className="text-xs font-normal mt-1">
                {formatPrice(vehicle?.pricing?.[d.value])}/{d.unit}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-group">
          <label className="label flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={today}
            placeholderText="Pick start date"
            className="input"
            dateFormat="dd MMM yyyy"
            wrapperClassName="w-full"
          />
        </div>

        <div className="form-group">
          <label className="label flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || today}
            placeholderText="Pick end date"
            className="input"
            dateFormat="dd MMM yyyy"
            wrapperClassName="w-full"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="label flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Any special requests or messages for the owner..."
          className="input resize-none"
        />
      </div>

      {/* Price Summary */}
      {calculation.totalDays > 0 && (
        <div className="card p-5 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
          <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Price Breakdown
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex-between">
              <span className="text-secondary-600">Duration</span>
              <span className="font-semibold">
                {calculation.totalDays} days
              </span>
            </div>
            <div className="flex-between">
              <span className="text-secondary-600">Rate</span>
              <span className="font-semibold">
                {formatPrice(vehicle?.pricing?.[durationType])}/{durationType}
              </span>
            </div>
            <div className="flex-between pt-2 border-t border-primary-200">
              <span className="font-semibold text-secondary-900">Total Amount</span>
              <span className="text-2xl font-bold gradient-text">
                {formatPrice(calculation.amount)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={!startDate || !endDate || vehicle?.status !== "available"}
      >
        {vehicle?.status !== "available"
          ? `Vehicle ${vehicle?.status}`
          : "Send Booking Request"}
      </Button>

      <p className="text-xs text-secondary-500 text-center">
        🔒 Your booking will be sent to owner for approval
      </p>
    </form>
  );
};

export default BookingForm;