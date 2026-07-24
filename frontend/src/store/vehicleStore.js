import { create } from "zustand";
import vehicleService from "../services/vehicleService";

const useVehicleStore = create((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  currentVehicle: null, // ✅ Alias for compatibility
  myVehicles: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    type: "",
    fuelType: "",
    transmission: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    durationType: "daily",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  },

  // ─── Fetch All Vehicles ───────────────────────
  fetchVehicles: async (customParams = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = { ...get().filters, ...customParams };
      const response = await vehicleService.getAllVehicles(params);

      // ✅ Handle different response structures
      let vehiclesArray = [];
      if (Array.isArray(response.data)) {
        vehiclesArray = response.data;
      } else if (response.data?.vehicles) {
        vehiclesArray = response.data.vehicles;
      } else if (response.data?.data) {
        vehiclesArray = response.data.data;
      }

      set({
        vehicles: vehiclesArray,
        pagination: response.pagination || response.data?.pagination || null,
        isLoading: false,
      });

      console.log(`✅ Fetched ${vehiclesArray.length} vehicles`);
      return response;
    } catch (error) {
      console.error("❌ Fetch vehicles error:", error);
      const message = error.response?.data?.message || "Failed to fetch vehicles";
      set({ isLoading: false, error: message, vehicles: [] });
      return null;
    }
  },

  // ─── Fetch Single Vehicle ─────────────────────
  fetchVehicleById: async (id) => {
    set({ isLoading: true, error: null, selectedVehicle: null, currentVehicle: null });
    try {
      const response = await vehicleService.getVehicleById(id);
      console.log("📦 Vehicle detail response:", response);

      // ✅ Handle different response structures
      let vehicle = null;
      if (response.data?.vehicle) {
        vehicle = response.data.vehicle;
      } else if (response.data?.data?.vehicle) {
        vehicle = response.data.data.vehicle;
      } else if (response.vehicle) {
        vehicle = response.vehicle;
      } else if (response.data && response.data._id) {
        vehicle = response.data;
      }

      if (!vehicle) {
        throw new Error("Vehicle data not found in response");
      }

      // ✅ Set BOTH names for compatibility
      set({
        selectedVehicle: vehicle,
        currentVehicle: vehicle,
        isLoading: false,
      });

      console.log(`✅ Loaded vehicle: ${vehicle.brand} ${vehicle.model}`);
      return vehicle;
    } catch (error) {
      console.error("❌ Fetch vehicle by ID error:", error);
      const message = error.response?.data?.message || "Vehicle not found";
      set({
        isLoading: false,
        error: message,
        selectedVehicle: null,
        currentVehicle: null,
      });
      return null;
    }
  },

  // ─── Fetch My Vehicles (Owner) ────────────────
  fetchMyVehicles: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getMyVehicles(params);

      let vehiclesArray = [];
      if (Array.isArray(response.data)) {
        vehiclesArray = response.data;
      } else if (response.data?.vehicles) {
        vehiclesArray = response.data.vehicles;
      }

      set({
        myVehicles: vehiclesArray,
        pagination: response.pagination || null,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message, myVehicles: [] });
      return null;
    }
  },

  // ─── Add Vehicle ──────────────────────────────
  addVehicle: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await vehicleService.addVehicle(formData);
      set({ isLoading: false });
      return {
        success: true,
        message: response.message,
        vehicle: response.data?.vehicle || response.data,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add vehicle";
      set({ isLoading: false });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  },

  // ─── Update Vehicle ───────────────────────────
  updateVehicle: async (id, formData) => {
    set({ isLoading: true });
    try {
      const response = await vehicleService.updateVehicle(id, formData);
      set({ isLoading: false });
      return {
        success: true,
        message: response.message,
        vehicle: response.data?.vehicle || response.data,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      set({ isLoading: false });
      return { success: false, message };
    }
  },

  // ─── Delete Vehicle ───────────────────────────
  deleteVehicle: async (id) => {
    try {
      const response = await vehicleService.deleteVehicle(id);
      set((state) => ({
        myVehicles: state.myVehicles.filter((v) => v._id !== id),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Delete failed";
      return { success: false, message };
    }
  },

  // ─── Toggle Maintenance ───────────────────────
  toggleMaintenance: async (id) => {
    try {
      const response = await vehicleService.toggleMaintenance(id);
      set((state) => ({
        myVehicles: state.myVehicles.map((v) =>
          v._id === id ? response.data.vehicle : v
        ),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      return { success: false, message };
    }
  },

  // ─── Set Filters ──────────────────────────────
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        type: "",
        fuelType: "",
        transmission: "",
        location: "",
        minPrice: "",
        maxPrice: "",
        durationType: "daily",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
        limit: 12,
      },
    });
  },

  setPage: (page) => {
    set((state) => ({ filters: { ...state.filters, page } }));
  },

  clearSelectedVehicle: () =>
    set({ selectedVehicle: null, currentVehicle: null }),
}));

export default useVehicleStore;