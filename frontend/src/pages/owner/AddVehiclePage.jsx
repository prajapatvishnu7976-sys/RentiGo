import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import VehicleForm from "../../components/vehicles/VehicleForm";
import useVehicleStore from "../../store/vehicleStore";

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const { addVehicle, isLoading } = useVehicleStore();

  const handleSubmit = async (data) => {
    const result = await addVehicle(data);
    if (result.success) {
      toast.success(result.message);
      navigate("/owner/vehicles");
    } else {
      toast.error(result.message);
      if (result.errors) {
        result.errors.forEach((err) => toast.error(err.message));
      }
    }
  };

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
        <h1 className="page-title">Add New Vehicle 🚗</h1>
        <p className="page-subtitle">
          Fill in the details to list your vehicle for rent. It will be reviewed by admin before going live.
        </p>
      </div>

      <VehicleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddVehiclePage;