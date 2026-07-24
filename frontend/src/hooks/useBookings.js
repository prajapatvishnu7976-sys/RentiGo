import useBookingStore from "../store/bookingStore";

const useBookings = () => {
  return useBookingStore();
};

export default useBookings;