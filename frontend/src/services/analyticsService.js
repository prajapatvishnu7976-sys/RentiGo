import api from "./api";
import { buildQueryString } from "../utils/helpers";

const analyticsService = {
  getRevenueAnalytics: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/analytics/revenue?${query}`);
    return response.data;
  },

  getBookingAnalytics: async () => {
    const response = await api.get("/analytics/bookings");
    return response.data;
  },

  getFleetAnalytics: async () => {
    const response = await api.get("/analytics/fleet");
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get("/analytics/users");
    return response.data;
  },
};

export default analyticsService;