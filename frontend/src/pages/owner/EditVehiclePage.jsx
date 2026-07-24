import React, { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import VehicleForm from "../../components/vehicles/VehicleForm";
import useVehicleStore from "../../store/vehicleStore";
import Loader from "../../components/common/Loader";

const EditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedVehicle, isLoading,
    fetchVehicleById, updateVehicle, clearSelectedVehicle,
  } = useVehicleStore();

  useEffect(() => {
    fetchVehicleById(id);
    return () => clearSelectedVehicle();
  }, [id]);

  const handleSubmit = async (data) => {
    const result = await updateVehicle(id, data);
    if (result.success) {
      toast.success(result.message);
      navigate("/owner/vehicles");
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading && !selectedVehicle) {
    return <Loader fullScreen text="Loading vehicle..." />;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/owner/vehicles"
        className="inline-flex items-center gap-1 text-secondary-600 hover:text-primary-600 font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Vehicles
      </Link>

      <div>
        <h1 className="page-title">Edit Vehicle ✏️</h1>
        <p className="page-subtitle">
          Update your vehicle details. Changes will require admin re-approval.
        </p>
      </div>

      {selectedVehicle && (
        <VehicleForm
          initialData={selectedVehicle}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit
        />
      )}
    </div>
  );
};

export default EditVehiclePage;