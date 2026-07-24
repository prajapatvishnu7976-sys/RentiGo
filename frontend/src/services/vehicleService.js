import api from "./api";
import { buildQueryString } from "../utils/helpers";

const vehicleService = {
  // Public
  getAllVehicles: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/vehicles?${query}`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Owner
  getMyVehicles: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/vehicles/owner/my-vehicles?${query}`);
    return response.data;
  },

  addVehicle: async (formData) => {
    const response = await api.post("/vehicles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateVehicle: async (id, formData) => {
    const response = await api.put(`/vehicles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  deleteVehicleImage: async (id, filename) => {
    const response = await api.delete(`/vehicles/${id}/images/${filename}`);
    return response.data;
  },

  toggleMaintenance: async (id) => {
    const response = await api.put(`/vehicles/${id}/maintenance`);
    return response.data;
  },

  // Admin
  getAllVehiclesAdmin: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/vehicles/admin/all?${query}`);
    return response.data;
  },
};

export default vehicleService;