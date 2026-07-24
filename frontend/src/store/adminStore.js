import { create } from "zustand";
import adminService from "../services/adminService";
import analyticsService from "../services/analyticsService";

const useAdminStore = create((set) => ({
  dashboardStats: null,
  systemOverview: null,
  pendingListings: [],
  pricingOverview: null,
  users: [],
  selectedUser: null,
  locations: [],
  revenueAnalytics: null,
  bookingAnalytics: null,
  fleetAnalytics: null,
  userAnalytics: null,
  pagination: null,
  isLoading: false,
  error: null,

  // ─── Dashboard ────────────────────────────────
  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const response = await adminService.getDashboardStats();
      set({ dashboardStats: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  fetchSystemOverview: async () => {
    try {
      const response = await adminService.getSystemOverview();
      set({ systemOverview: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // ─── Vehicle Approvals ────────────────────────
  fetchPendingListings: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await adminService.getPendingListings(params);
      set({
        pendingListings: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  updateListingStatus: async (id, data) => {
    try {
      const response = await adminService.updateVehicleListingStatus(id, data);
      set((state) => ({
        pendingListings: state.pendingListings.filter((v) => v._id !== id),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // ─── Users ────────────────────────────────────
  fetchAllUsers: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await adminService.getAllUsers(params);
      set({
        users: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  fetchUserById: async (id) => {
    try {
      const response = await adminService.getUserById(id);
      set({ selectedUser: response.data.user });
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  updateUserStatus: async (id, isActive) => {
    try {
      const response = await adminService.updateUserStatus(id, isActive);
      set((state) => ({
        users: state.users.map((u) =>
          u._id === id ? response.data.user : u
        ),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await adminService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // ─── Locations ────────────────────────────────
  fetchLocations: async (params = {}) => {
    try {
      const response = await adminService.getAllLocations(params);
      set({ locations: response.data.locations });
      return response.data.locations;
    } catch (error) {
      return [];
    }
  },

  createLocation: async (data) => {
    try {
      const response = await adminService.createLocation(data);
      set((state) => ({
        locations: [...state.locations, response.data.location],
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  updateLocation: async (id, data) => {
    try {
      const response = await adminService.updateLocation(id, data);
      set((state) => ({
        locations: state.locations.map((l) =>
          l._id === id ? response.data.location : l
        ),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  deleteLocation: async (id) => {
    try {
      const response = await adminService.deleteLocation(id);
      set((state) => ({
        locations: state.locations.filter((l) => l._id !== id),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // ─── Analytics ────────────────────────────────
  fetchRevenueAnalytics: async (params = {}) => {
    try {
      const response = await analyticsService.getRevenueAnalytics(params);
      set({ revenueAnalytics: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  fetchBookingAnalytics: async () => {
    try {
      const response = await analyticsService.getBookingAnalytics();
      set({ bookingAnalytics: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  fetchFleetAnalytics: async () => {
    try {
      const response = await analyticsService.getFleetAnalytics();
      set({ fleetAnalytics: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  fetchUserAnalytics: async () => {
    try {
      const response = await analyticsService.getUserAnalytics();
      set({ userAnalytics: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // ─── Pricing ──────────────────────────────────
  fetchPricingOverview: async () => {
    try {
      const response = await adminService.getPricingOverview();
      set({ pricingOverview: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },
}));

export default useAdminStore;