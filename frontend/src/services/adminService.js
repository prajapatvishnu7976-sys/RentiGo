import api from "./api";
import { buildQueryString } from "../utils/helpers";

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getSystemOverview: async () => {
    const response = await api.get("/admin/system/overview");
    return response.data;
  },

  // Vehicle Approval
  getPendingListings: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/admin/vehicles/pending?${query}`);
    return response.data;
  },

  updateVehicleListingStatus: async (id, data) => {
    const response = await api.put(`/admin/vehicles/${id}/listing-status`, data);
    return response.data;
  },

  // Pricing
  getPricingOverview: async () => {
    const response = await api.get("/admin/pricing");
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/users?${query}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/users/${id}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUserBookings: async (id) => {
    const response = await api.get(`/users/${id}/bookings`);
    return response.data;
  },

  // Locations
  getAllLocations: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/locations?${query}`);
    return response.data;
  },

  createLocation: async (data) => {
    const response = await api.post("/locations", data);
    return response.data;
  },

  updateLocation: async (id, data) => {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },

  deleteLocation: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },

  toggleLocationStatus: async (id) => {
    const response = await api.put(`/locations/${id}/toggle-status`);
    return response.data;
  },
};

export default adminService;