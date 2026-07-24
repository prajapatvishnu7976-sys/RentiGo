import api from "./api";
import { buildQueryString } from "../utils/helpers";

const bookingService = {
  // Customer
  createBooking: async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  getMyBookings: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/bookings/my-bookings?${query}`);
    return response.data;
  },

  cancelBooking: async (id, data = {}) => {
    const response = await api.put(`/bookings/${id}/cancel`, data);
    return response.data;
  },

  // Owner
  getOwnerBookings: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/bookings/owner-bookings?${query}`);
    return response.data;
  },

  updateBookingStatus: async (id, data) => {
    const response = await api.put(`/bookings/${id}/status`, data);
    return response.data;
  },

  // Common
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  checkAvailability: async (data) => {
    const response = await api.post("/bookings/check-availability", data);
    return response.data;
  },

  // Admin
  getAllBookings: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/bookings/admin/all?${query}`);
    return response.data;
  },
};

export default bookingService;