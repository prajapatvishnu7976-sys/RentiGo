import React, { useEffect, useState } from "react";
import { Calendar, Check, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import useBookingStore from "../../store/bookingStore";
import { CardSkeleton } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import {
  formatDate, formatPrice, formatRelativeTime, getImageUrl,
} from "../../utils/helpers";
import { BOOKING_STATUSES } from "../../utils/constants";

const OwnerBookings = () => {
  const {
    ownerBookings, pagination, isLoading,
    fetchOwnerBookings, updateBookingStatus,
  } = useBookingStore();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    fetchOwnerBookings(params);
  }, [statusFilter, page]);

  const handleApprove = async (id) => {
    setUpdating(true);
    const result = await updateBookingStatus(id, { status: "approved" });
    setUpdating(false);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setUpdating(true);
    const result = await updateBookingStatus(rejectModal._id, {
      status: "rejected",
      rejectionReason: rejectReason,
    });
    setUpdating(false);

    if (result.success) {
      toast.success(result.message);
      setRejectModal(null);
      setRejectReason("");
    } else {
      toast.error(result.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    const result = await updateBookingStatus(id, { status });
    setUpdating(false);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings Management 📅</h1>
          <p className="page-subtitle">
            {pagination?.totalItems || 0} total bookings
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
      ) : ownerBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description="When customers book your vehicles, they'll appear here"
        />
      ) : (
        <>
          <div className="space-y-4">
            {ownerBookings.map((b) => (
              <div key={b._id} className="card p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Vehicle Image */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {b.vehicle?.images?.[0] ? (
                      <img
                        src={getImageUrl(b.vehicle.images[0].url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex-center text-4xl">
                        {b.vehicle?.type === "2W" ? "🛵" : "🚗"}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex-between mb-3 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">
                            {b.vehicle?.brand} {b.vehicle?.model}
                          </h3>
                          <StatusBadge status={b.status} size="sm" />
                        </div>
                        <p className="text-xs text-secondary-500 font-mono">
                          #{b.bookingId}
                        </p>
                      </div>
                      <p className="text-sm text-secondary-500">
                        {formatRelativeTime(b.createdAt)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3 py-3 border-y border-gray-100">
                      <div>
                        <p className="text-xs text-secondary-500">Customer</p>
                        <p className="font-medium">{b.customer?.name}</p>
                        <p className="text-xs">+91 {b.customer?.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Dates</p>
                        <p className="font-medium text-xs">
                          {formatDate(b.startDate)}
                        </p>
                        <p className="text-xs">to {formatDate(b.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Duration</p>
                        <p className="font-medium">
                          {b.totalDays} days ({b.durationType})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Amount</p>
                        <p className="font-bold gradient-text">
                          {formatPrice(b.totalAmount)}
                        </p>
                      </div>
                    </div>

                    {b.customerNotes && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                        <p className="text-xs text-blue-700 flex items-start gap-1">
                          <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Customer note:</strong> {b.customerNotes}
                          </span>
                        </p>
                      </div>
                    )}

                    {b.rejectionReason && (
                      <div className="bg-danger-50 border border-danger-100 rounded-lg p-3 mb-3">
                        <p className="text-xs text-danger-700">
                          <strong>Rejection reason:</strong> {b.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {b.status === "pending" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApprove(b._id)}
                            isLoading={updating}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            onClick={() => setRejectModal(b)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {b.status === "approved" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(b._id, "active")}
                          isLoading={updating}
                        >
                          Mark as Active
                        </Button>
                      )}

                      {b.status === "active" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(b._id, "completed")}
                          isLoading={updating}
                        >
                          Mark as Completed
                        </Button>
                      )}

                      {b.status === "completed" && (
                        <span className="text-sm text-success-600 font-medium flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Booking completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => {
          setRejectModal(null);
          setRejectReason("");
        }}
        title="Reject Booking"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            Please provide a reason for rejecting this booking. The customer will be notified.
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Vehicle not available for these dates..."
            rows={4}
            className="input resize-none"
            maxLength={300}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectModal(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={updating}
            >
              Reject Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerBookings;