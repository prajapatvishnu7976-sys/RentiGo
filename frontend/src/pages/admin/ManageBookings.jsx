import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import useBookingStore from "../../store/bookingStore";
import { CardSkeleton } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { StatusBadge } from "../../components/common/Badge";
import { BOOKING_STATUSES } from "../../utils/constants";
import {
  formatDate, formatPrice, formatRelativeTime, getInitials,
} from "../../utils/helpers";

const ManageBookings = () => {
  const { allBookings, pagination, isLoading, fetchAllBookings } = useBookingStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    fetchAllBookings(params);
  }, [statusFilter, page]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Bookings 📅</h1>
          <p className="page-subtitle">
            Monitor all platform bookings ({pagination?.totalItems || 0} total)
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => {
            setStatusFilter("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            statusFilter === ""
              ? "bg-primary-500 text-white"
              : "bg-white border border-gray-200 hover:border-primary-300"
          }`}
        >
          All
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => {
              setStatusFilter(s.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              statusFilter === s.value
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-200 hover:border-primary-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <CardSkeleton count={3} />
      ) : allBookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings found" />
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Owner</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <p className="text-xs font-mono text-secondary-700">
                        #{b.bookingId}
                      </p>
                    </td>
                    <td>
                      <p className="font-semibold text-sm">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </p>
                      <p className="text-xs text-secondary-500 font-mono">
                        {b.vehicle?.vehicleNumber}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 gradient-bg rounded-lg flex-center text-white font-semibold text-xs">
                          {getInitials(b.customer?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{b.customer?.name}</p>
                          <p className="text-xs text-secondary-500">
                            +91 {b.customer?.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm">{b.owner?.name}</p>
                      {b.owner?.businessName && (
                        <p className="text-xs text-secondary-500">
                          {b.owner.businessName}
                        </p>
                      )}
                    </td>
                    <td>
                      <p className="text-xs">{formatDate(b.startDate)}</p>
                      <p className="text-xs text-secondary-500">
                        to {formatDate(b.endDate)}
                      </p>
                      <p className="text-xs text-primary-600 mt-0.5">
                        {b.totalDays} days
                      </p>
                    </td>
                    <td>
                      <p className="font-bold gradient-text">
                        {formatPrice(b.totalAmount)}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td>
                      <p className="text-xs text-secondary-500">
                        {formatRelativeTime(b.createdAt)}
                      </p>
                    </td>
                    <td>
                      <Link
                        to={`/bookings/${b._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default ManageBookings;