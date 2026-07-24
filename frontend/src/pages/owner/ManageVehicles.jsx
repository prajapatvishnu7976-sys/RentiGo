import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Edit, Trash2, Wrench, Car, Eye, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import useVehicleStore from "../../store/vehicleStore";
import Button from "../../components/common/Button";
import { StatusBadge } from "../../components/common/Badge";
import { CardSkeleton } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import { getVehicleFallback } from "../../utils/vehicleImages";

const ManageVehicles = () => {
  const navigate = useNavigate();
  const {
    myVehicles, pagination, isLoading,
    fetchMyVehicles, deleteVehicle, toggleMaintenance,
  } = useVehicleStore();

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, [filter, page]);

  const loadVehicles = () => {
    const params = { page, limit: 12 };
    if (filter !== "all") {
      if (["available", "booked", "maintenance"].includes(filter)) {
        params.status = filter;
      } else {
        params.listingStatus = filter;
      }
    }
    fetchMyVehicles(params);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const result = await deleteVehicle(confirmDelete._id);
    if (result.success) {
      toast.success(result.message);
      setConfirmDelete(null);
      loadVehicles();
    } else {
      toast.error(result.message);
    }
  };

  const handleMaintenance = async (id) => {
    const result = await toggleMaintenance(id);
    if (result.success) {
      toast.success(result.message);
      loadVehicles();
    } else {
      toast.error(result.message);
    }
  };

  const filters = [
    { value: "all", label: "All Vehicles" },
    { value: "available", label: "Available" },
    { value: "booked", label: "Booked" },
    { value: "maintenance", label: "Maintenance" },
    { value: "pending", label: "Pending Approval" },
    { value: "rejected", label: "Rejected" },
  ];

  const vehiclesArray = Array.isArray(myVehicles) ? myVehicles : [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Vehicles 🚗</h1>
          <p className="page-subtitle">
            {pagination?.total || vehiclesArray.length} vehicles in your fleet
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadVehicles}
            className="btn-outline btn-sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link to="/owner/vehicles/add" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === f.value
                ? "bg-primary-500 text-white shadow-md"
                : "bg-white border border-gray-200 hover:border-primary-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && vehiclesArray.length === 0 ? (
        <CardSkeleton count={4} />
      ) : vehiclesArray.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles found"
          description={filter !== "all" ? "Try changing the filter" : "Start by adding your first vehicle"}
          action={
            <Link to="/owner/vehicles/add" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehiclesArray.map((v) => {
              // 🔥 Smart Image Logic - Same as customer panel
              const vehicleImage = v.images?.[0]?.url
                ? getImageUrl(v.images[0].url)
                : getVehicleFallback(v.type, v.brand, v.model, v.category);

              return (
                <div key={v._id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image - White BG like customer panel */}
                  <div className="h-52 flex items-center justify-center p-4 bg-white border-b border-gray-100 relative">
                    <img
                      src={vehicleImage}
                      alt={`${v.brand} ${v.model}`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = getVehicleFallback(v.type, v.brand, v.model);
                      }}
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <StatusBadge status={v.status} size="sm" />
                      {v.listingStatus === "pending" && (
                        <span className="badge-warning text-[10px]">⏳ Pending</span>
                      )}
                      {v.listingStatus === "rejected" && (
                        <span className="badge-danger text-[10px]">❌ Rejected</span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold text-white ${
                      v.type === "2W" ? "bg-blue-500" : "bg-purple-500"
                    }`}>
                      {v.type === "2W" ? "🏍️ 2W" : "🚗 4W"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg">
                        {v.brand} {v.model}
                      </h3>
                      <p className="text-xs text-secondary-500 font-mono">
                        {v.vehicleNumber}
                      </p>
                    </div>

                    <div className="flex-between mb-3 text-sm">
                      <span className="text-secondary-500">Daily Rate</span>
                      <span className="font-bold gradient-text">
                        {formatPrice(v.pricing?.daily)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-center text-xs py-2 border-y border-gray-100 mb-3">
                      <div>
                        <p className="text-secondary-500">Bookings</p>
                        <p className="font-semibold">{v.totalBookings || 0}</p>
                      </div>
                      <div>
                        <p className="text-secondary-500">Revenue</p>
                        <p className="font-semibold">
                          ₹{((v.totalRevenue || 0) / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary-500">Rating</p>
                        <p className="font-semibold">
                          ⭐ {v.averageRating?.toFixed(1) || "0.0"}
                        </p>
                      </div>
                    </div>

                    {v.listingStatus === "rejected" && v.rejectionReason && (
                      <div className="bg-danger-50 border border-danger-100 rounded-lg p-2 mb-3">
                        <p className="text-xs text-danger-700">
                          <strong>Reason:</strong> {v.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-4 gap-1.5">
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="btn-ghost p-2 hover:bg-blue-50 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </Link>
                      <Link
                        to={`/owner/vehicles/edit/${v._id}`}
                        className="btn-ghost p-2 hover:bg-yellow-50 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 mx-auto" />
                      </Link>
                      <button
                        onClick={() => handleMaintenance(v._id)}
                        className="btn-ghost p-2 hover:bg-orange-50 hover:text-orange-600"
                        title="Toggle Maintenance"
                        disabled={v.status === "booked"}
                      >
                        <Wrench className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(v)}
                        className="btn-ghost p-2 text-danger-500 hover:bg-danger-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle?"
        message={`Are you sure you want to delete ${confirmDelete?.brand} ${confirmDelete?.model}? This cannot be undone.`}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
};

export default ManageVehicles;