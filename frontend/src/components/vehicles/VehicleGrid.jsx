import React from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import VehicleCard from "./VehicleCard";

const VehicleGrid = ({ vehicles, isLoading, columns = 4 }) => {
  // Loading Skeleton
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${columns} gap-5`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-[4/3]" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-5 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="flex gap-2 pt-3">
                <div className="skeleton h-8 flex-1 rounded-lg" />
                <div className="skeleton h-8 flex-1 rounded-lg" />
                <div className="skeleton h-8 flex-1 rounded-lg" />
              </div>
              <div className="flex justify-between pt-3">
                <div className="skeleton h-8 w-20 rounded" />
                <div className="skeleton h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!vehicles || vehicles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex-center mx-auto mb-4">
          <Car className="w-10 h-10 text-primary-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Vehicles Available</h3>
        <p className="text-secondary-500 max-w-md mx-auto">
          We couldn't find any vehicles matching your criteria. Try adjusting your filters.
        </p>
      </motion.div>
    );
  }

  // Vehicles Grid
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${columns} gap-5`}
    >
      {vehicles.map((vehicle, i) => (
        <motion.div
          key={vehicle._id || i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <VehicleCard vehicle={vehicle} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VehicleGrid;