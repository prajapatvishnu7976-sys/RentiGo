import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import adminService from "../../services/adminService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { INDIAN_STATES } from "../../utils/constants";

const ManageLocations = () => {
  const {
    locations, fetchLocations, createLocation,
    updateLocation, deleteLocation,
  } = useAdminStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    address: "",
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    await fetchLocations();
    setIsLoading(false);
  };

  const handleOpen = (loc = null) => {
    if (loc) {
      setEditingLocation(loc);
      setFormData({
        name: loc.name,
        city: loc.city,
        state: loc.state,
        pincode: loc.pincode,
        address: loc.address || "",
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        city: "",
        state: "Maharashtra",
        pincode: "",
        address: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = editingLocation
      ? await updateLocation(editingLocation._id, formData)
      : await createLocation(formData);

    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setShowModal(false);
      setEditingLocation(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const result = await deleteLocation(confirmDelete._id);
    if (result.success) {
      toast.success(result.message);
      setConfirmDelete(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleToggleStatus = async (loc) => {
    try {
      await adminService.toggleLocationStatus(loc._id);
      toast.success("Status updated");
      loadLocations();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <Loader fullScreen text="Loading locations..." />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Locations 📍</h1>
          <p className="page-subtitle">
            {locations.length} locations across India
          </p>
        </div>
        <Button onClick={() => handleOpen()} icon={Plus}>
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No locations yet"
          description="Add locations where vehicles can be picked up"
          action={
            <Button onClick={() => handleOpen()} icon={Plus}>
              Add First Location
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div key={loc._id} className="card p-5">
              <div className="flex-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <span
                  className={`badge ${
                    loc.isActive
                      ? "bg-success-50 text-success-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {loc.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
              <p className="text-sm text-secondary-600 mb-2">
                {loc.city}, {loc.state}
              </p>
              <p className="text-xs text-secondary-500 mb-3 font-mono">
                PIN: {loc.pincode}
              </p>

              {loc.address && (
                <p className="text-xs text-secondary-600 mb-4 line-clamp-2">
                  {loc.address}
                </p>
              )}

              <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleStatus(loc)}
                  className="flex-1 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Toggle status"
                >
                  {loc.isActive ? (
                    <ToggleRight className="w-5 h-5 text-success-500 mx-auto" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-secondary-400 mx-auto" />
                  )}
                </button>
                <button
                  onClick={() => handleOpen(loc)}
                  className="flex-1 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-primary-600 mx-auto" />
                </button>
                <button
                  onClick={() => setConfirmDelete(loc)}
                  className="flex-1 p-2 hover:bg-danger-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-danger-500 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLocation ? "Edit Location" : "Add New Location"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Location Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Andheri Hub"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Mumbai"
              required
            />

            <div className="form-group">
              <label className="label">State *</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="input"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="400053"
            maxLength={6}
            required
          />

          <div className="form-group">
            <label className="label">Address (Optional)</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address with landmarks..."
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingLocation ? "Update" : "Create"} Location
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Location?"
        message={`Are you sure you want to delete "${confirmDelete?.name}"?`}
        variant="danger"
      />
    </div>
  );
};

export default ManageLocations;