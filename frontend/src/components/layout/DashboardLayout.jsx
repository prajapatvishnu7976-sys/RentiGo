import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-secondary-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
              </button>

              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 rounded-xl p-1.5 pr-3 transition-colors">
                <div className="w-9 h-9 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight">
                    {user?.name?.split(" ")[0]}
                  </p>
                  <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;