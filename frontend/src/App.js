import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

// Scroll to Top Component
import ScrollToTop from "./components/common/ScrollToTop";

// Layouts
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import VehiclesPage from "./pages/customer/VehiclesPage";
import VehicleDetailPage from "./pages/customer/VehicleDetailPage";
import BookingPage from "./pages/customer/BookingPage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";
import BookingTrackPage from "./pages/customer/BookingTrackPage";
import ProfilePage from "./pages/customer/ProfilePage";

// New Public Pages
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import PricingPage from "./pages/public/PricingPage";
import RentalCitiesPage from "./pages/public/RentalCitiesPage";
import CityPage from "./pages/public/CityPage";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManageVehicles from "./pages/owner/ManageVehicles";
import AddVehiclePage from "./pages/owner/AddVehiclePage";
import EditVehiclePage from "./pages/owner/EditVehiclePage";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageListings from "./pages/admin/ManageListings";
import ManageBookings from "./pages/admin/ManageBookings";
import ManagePricing from "./pages/admin/ManagePricing";
import ManageLocations from "./pages/admin/ManageLocations";
import SystemAnalytics from "./pages/admin/SystemAnalytics";

function App() {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("rentigo_token");
    if (token) {
      fetchCurrentUser?.();
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ═══ Public + Customer Routes (with Navbar/Footer) ═══ */}
        <Route element={<Layout />}>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/rental-cities" element={<RentalCitiesPage />} />
          <Route path="/city/:cityName" element={<CityPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Only - Booking Page */}
          <Route
            path="/book/:vehicleId"
            element={
              <ProtectedRoute roles={["customer"]}>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* 🔥 My Bookings - ALL ROLES (Customer, Owner, Admin) */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute roles={["customer", "admin", "owner"]}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* 🔥 Booking Track Page - ALL ROLES */}
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute roles={["customer", "admin", "owner"]}>
                <BookingTrackPage />
              </ProtectedRoute>
            }
          />

          {/* Profile - All Roles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ═══ Owner Dashboard ═══ */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={["owner"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="vehicles/add" element={<AddVehiclePage />} />
          <Route path="vehicles/edit/:id" element={<EditVehiclePage />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="analytics" element={<OwnerAnalytics />} />
        </Route>

        {/* ═══ Admin Dashboard ═══ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="listings" element={<ManageListings />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="pricing" element={<ManagePricing />} />
          <Route path="locations" element={<ManageLocations />} />
          <Route path="analytics" element={<SystemAnalytics />} />
        </Route>

        {/* ═══ 404 Page ═══ */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex-center flex-col gap-6 bg-gradient-to-br from-primary-50 to-orange-50">
              <div className="text-center">
                <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
                <div className="text-6xl mb-4">🚗💨</div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                  Oops! Page Not Found
                </h2>
                <p className="text-secondary-600 mb-8 max-w-md mx-auto">
                  Looks like this road doesn't exist. Let's get you back on track!
                </p>
                <div className="flex gap-3 justify-center">
                  <a href="/" className="btn-primary btn-lg">
                    🏠 Go Home
                  </a>
                  <a href="/vehicles" className="btn-outline btn-lg">
                    🚗 Browse Vehicles
                  </a>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;