import { useEffect } from "react";
import useVehicleStore from "../store/vehicleStore";

const useVehicles = (autoFetch = true) => {
  const store = useVehicleStore();

  useEffect(() => {
    if (autoFetch) {
      store.fetchVehicles();
    }
  }, [store.filters, autoFetch]);

  return store;
};

export default useVehicles;