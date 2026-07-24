import { create } from "zustand";
import bookingService from "../services/bookingService";

const useBookingStore = create((set, get) => ({
  bookings: [],
  ownerBookings: [],
  allBookings: [],
  selectedBooking: null,
  pagination: null,
  isLoading: false,
  error: null,

  // ─── Create Booking ───────────────────────────
  createBooking: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.createBooking(data);
      console.log("✅ Booking created:", response);

      const booking = response.data?.booking || response.booking;
      set({ isLoading: false });
      return {
        success: true,
        message: response.message || "Booking created",
        booking,
      };
    } catch (error) {
      console.error("❌ Booking creation error:", error);
      const message = error.response?.data?.message || "Booking failed";
      set({ isLoading: false, error: message });
      return { success: false, message };
    }
  },

  // ─── My Bookings ──────────────────────────────
  fetchMyBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getMyBookings(params);
      console.log("📦 My Bookings response:", response);

      // Handle multiple response structures
      let bookingsArray = [];
      if (Array.isArray(response.data)) {
        bookingsArray = response.data;
      } else if (response.data?.bookings) {
        bookingsArray = response.data.bookings;
      } else if (response.bookings) {
        bookingsArray = response.bookings;
      } else if (Array.isArray(response)) {
        bookingsArray = response;
      }

      console.log(`✅ Loaded ${bookingsArray.length} bookings`);

      set({
        bookings: bookingsArray,
        pagination: response.pagination || response.data?.pagination || null,
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.error("❌ Fetch bookings error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message,
        bookings: [],
      });
      return null;
    }
  },

  // ─── Owner Bookings ───────────────────────────
  fetchOwnerBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getOwnerBookings(params);

      let bookingsArray = [];
      if (Array.isArray(response.data)) {
        bookingsArray = response.data;
      } else if (response.data?.bookings) {
        bookingsArray = response.data.bookings;
      }

      set({
        ownerBookings: bookingsArray,
        pagination: response.pagination || null,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        ownerBookings: [],
      });
      return null;
    }
  },

  // ─── All Bookings (Admin) ─────────────────────
  fetchAllBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getAllBookings(params);

      let bookingsArray = [];
      if (Array.isArray(response.data)) {
        bookingsArray = response.data;
      } else if (response.data?.bookings) {
        bookingsArray = response.data.bookings;
      }

      set({
        allBookings: bookingsArray,
        pagination: response.pagination || null,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message, allBookings: [] });
      return null;
    }
  },

  // ─── Single Booking ───────────────────────────
  fetchBookingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getBookingById(id);
      const booking =
        response.data?.booking || response.booking || response.data;

      set({
        selectedBooking: booking,
        isLoading: false,
      });
      return booking;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // ─── Update Booking Status ────────────────────
  updateBookingStatus: async (id, data) => {
    try {
      const response = await bookingService.updateBookingStatus(id, data);
      const updatedBooking = response.data?.booking || response.booking;

      set((state) => ({
        ownerBookings: state.ownerBookings.map((b) =>
          b._id === id ? updatedBooking : b
        ),
        allBookings: state.allBookings.map((b) =>
          b._id === id ? updatedBooking : b
        ),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      return { success: false, message };
    }
  },

  // ─── Cancel Booking ───────────────────────────
  cancelBooking: async (id, data = {}) => {
    try {
      const response = await bookingService.cancelBooking(id, data);
      const cancelledBooking = response.data?.booking || response.booking;

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id ? cancelledBooking : b
        ),
      }));
      return { success: true, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || "Cancel failed";
      return { success: false, message };
    }
  },

  // ─── Check Availability ───────────────────────
  checkAvailability: async (data) => {
    try {
      const response = await bookingService.checkAvailability(data);
      return { success: true, ...response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  clearSelectedBooking: () => set({ selectedBooking: null }),
  clearBookings: () => set({ bookings: [] }),
}));

export default useBookingStore;