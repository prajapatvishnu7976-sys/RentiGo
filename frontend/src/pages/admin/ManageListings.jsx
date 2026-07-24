import React, { useEffect, useState } from "react";
import { Car, Check, X, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useAdminStore from "../../store/adminStore";
import { CardSkeleton } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { formatPrice, getImageUrl, formatDate } from "../../utils/helpers";

const ManageListings = () => {
  const {
    pendingListings, pagination, isLoading,
    fetchPendingListings, updateListingStatus,
  } = useAdminStore();

  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPendingListings({ page, limit: 10 });
  }, [page]);

  const handleApprove = async (id) => {
    setUpdating(true);
    const result = await updateListingStatus(id, { listingStatus: "approved" });
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
    const result = await updateListingStatus(rejectModal._id, {
      listingStatus: "rejected",
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

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicle Approvals ✅</h1>
          <p className="page-subtitle">
            {pagination?.totalItems || 0} vehicles waiting for approval
          </p>
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={3} />
      ) : pendingListings.length === 0 ? (
        <EmptyState
          icon={Check}
          title="All Caught Up! 🎉"
          description="No pending vehicle listings to review"
        />
      ) : (
        <>
          <div className="space-y-4">
            {pendingListings.map((v) => (
              <div key={v._id} className="card p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {v.images?.[0] ? (
                      <img
                        src={getImageUrl(v.images[0].url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex-center text-5xl">
                        {v.type === "2W" ? "🛵" : "🚗"}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex-between mb-3 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">
                            {v.brand} {v.model}
                          </h3>
                          <span className="badge-warning">⏳ Pending</span>
                          <span className={`badge ${v.type === "2W" ? "type-2w" : "type-4w"}`}>
                            {v.type === "2W" ? "🛵" : "🚗"} {v.type}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-500 font-mono">
                          {v.vehicleNumber} • {v.modelYear}
                        </p>
                      </div>
                      <p className="text-xs text-secondary-500">
                        Submitted: {formatDate(v.createdAt)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 py-3 border-y border-gray-100 text-sm">
                      <div>
                        <p className="text-xs text-secondary-500">Owner</p>
                        <p className="font-medium">{v.owner?.name}</p>
                        {v.owner?.businessName && (
                          <p className="text-xs text-secondary-500">
                            {v.owner.businessName}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Location</p>
                        <p className="font-medium">{v.location?.name}</p>
                        <p className="text-xs">{v.location?.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Specs</p>
                        <p className="font-medium capitalize">
                          {v.fuelType} • {v.transmission}
                        </p>
                        <p className="text-xs">{v.seatingCapacity} seats</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-500">Daily Rate</p>
                        <p className="font-bold gradient-text">
                          {formatPrice(v.pricing?.daily)}
                        </p>
                      </div>
                    </div>

                    {v.description && (
                      <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                        {v.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        icon={Check}
                        onClick={() => handleApprove(v._id)}
                        isLoading={updating}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={X}
                        onClick={() => setRejectModal(v)}
                      >
                        Reject
                      </Button>
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="btn-outline btn-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
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
        title="Reject Vehicle Listing"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            Provide a reason for rejection. The owner will be notified.
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Vehicle images are unclear..."
            rows={4}
            className="input resize-none"
            maxLength={300}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setRejectModal(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={updating}>
              Reject Listing
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageListings;