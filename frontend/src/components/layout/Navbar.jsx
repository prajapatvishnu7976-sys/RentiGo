import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, User, LogOut, LayoutDashboard,
  Car, Calendar, ChevronDown, Bell, Phone,
  MapPin, Info, DollarSign, Home, Shield,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin, isOwner } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Our Rentals", path: "/vehicles", icon: Car },
    { name: "Rental Cities", path: "/rental-cities", icon: MapPin },
    { name: "Our Pricing", path: "/pricing", icon: DollarSign },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact Us", path: "/contact", icon: Phone },
  ];

  const dashboardLink = isAdmin
    ? "/admin/dashboard"
    : isOwner
    ? "/owner/dashboard"
    : "/my-bookings";

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // 🔥 Get bookings label based on role
  const getBookingsLabel = () => {
    if (isAdmin) return "All Bookings";
    if (isOwner) return "Owner Bookings";
    return "My Bookings";
  };

  // Get role badge color
  const getRoleBadge = () => {
    if (isAdmin) return { label: "Admin", color: "bg-purple-100 text-purple-700" };
    if (isOwner) return { label: "Owner", color: "bg-blue-100 text-blue-700" };
    return { label: "Customer", color: "bg-green-100 text-green-700" };
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── Logo ─────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 gradient-bg rounded-xl flex-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold gradient-text font-heading leading-none">
                RentiGo
              </span>
              <p className="text-[10px] text-secondary-500 font-medium">
                Premium Rentals
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ─────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-secondary-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── Right Side ─────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Book Now Button */}
            <Link
              to="/vehicles"
              className="hidden md:flex btn-primary btn-sm gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="hidden md:flex relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-secondary-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 gradient-bg rounded-lg flex-center text-white font-semibold text-sm shadow-md">
                      {getInitials(user?.name)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-secondary-900 leading-tight">
                        {user?.name?.split(" ")[0]}
                      </p>
                      <p className="text-xs text-secondary-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-secondary-600 transition-transform hidden md:block ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40"
                        >
                          {/* User Info */}
                          <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex-center font-bold text-lg">
                                {getInitials(user?.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold truncate">{user?.name}</p>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getRoleBadge().color}`}>
                                    {getRoleBadge().label}
                                  </span>
                                </div>
                                <p className="text-xs opacity-90 truncate mt-0.5">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            {/* Dashboard - All Roles */}
                            <Link
                              to={dashboardLink}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-secondary-600" />
                              <span className="text-sm font-medium">Dashboard</span>
                            </Link>

                            {/* Profile - All Roles */}
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-4 h-4 text-secondary-600" />
                              <span className="text-sm font-medium">My Profile</span>
                            </Link>

                            {/* 🔥 Bookings - ALL ROLES (Different labels) */}
                            <Link
                              to="/my-bookings"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-secondary-600" />
                              <span className="text-sm font-medium">
                                {getBookingsLabel()}
                              </span>
                              {isAdmin && (
                                <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                                  ADMIN
                                </span>
                              )}
                              {isOwner && (
                                <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                  OWNER
                                </span>
                              )}
                            </Link>

                            {/* Admin Only - Extra Links */}
                            {isAdmin && (
                              <>
                                <Link
                                  to="/admin/users"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  <Shield className="w-4 h-4 text-secondary-600" />
                                  <span className="text-sm font-medium">Manage Users</span>
                                </Link>
                                <Link
                                  to="/admin/listings"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  <Car className="w-4 h-4 text-secondary-600" />
                                  <span className="text-sm font-medium">Manage Listings</span>
                                </Link>
                              </>
                            )}

                            {/* Owner Only - Extra Links */}
                            {isOwner && (
                              <>
                                <Link
                                  to="/owner/vehicles"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  <Car className="w-4 h-4 text-secondary-600" />
                                  <span className="text-sm font-medium">My Vehicles</span>
                                </Link>
                                <Link
                                  to="/owner/vehicles/add"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  <Car className="w-4 h-4 text-secondary-600" />
                                  <span className="text-sm font-medium">Add Vehicle</span>
                                </Link>
                              </>
                            )}

                            <div className="border-t border-gray-100 my-2" />

                            {/* Logout */}
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger-50 hover:text-danger-600 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm font-medium">Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-outline btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary-50 text-primary-600"
                        : "text-secondary-700 hover:bg-gray-50"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}

                {/* Bookings link for authenticated users - Mobile */}
                {isAuthenticated && (
                  <Link
                    to="/my-bookings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive("/my-bookings")
                        ? "bg-primary-50 text-primary-600"
                        : "text-secondary-700 hover:bg-gray-50"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    {getBookingsLabel()}
                  </Link>
                )}

                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                  <Link to="/vehicles" className="btn-primary w-full">
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </Link>

                  {!isAuthenticated && (
                    <>
                      <Link to="/login" className="btn-outline w-full">
                        Login
                      </Link>
                      <Link to="/register" className="btn-ghost w-full border border-gray-200">
                        Sign Up Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;