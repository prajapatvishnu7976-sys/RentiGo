import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, Calendar, MapPin,
  DollarSign, BarChart3, FileText, Settings,
  Plus, ListChecks,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin, isOwner } = useAuth();

  const adminMenu = [
    { icon: LayoutDashboard, label: "Dashboard",       path: "/admin/dashboard"  },
    { icon: Users,           label: "Users",           path: "/admin/users"      },
    { icon: ListChecks,      label: "Vehicle Listings",path: "/admin/listings"   },
    { icon: Calendar,        label: "Bookings",        path: "/admin/bookings"   },
    { icon: MapPin,          label: "Locations",       path: "/admin/locations"  },
    { icon: DollarSign,      label: "Pricing",         path: "/admin/pricing"    },
    { icon: BarChart3,       label: "Analytics",       path: "/admin/analytics"  },
  ];

  const ownerMenu = [
    { icon: LayoutDashboard, label: "Dashboard",       path: "/owner/dashboard"        },
    { icon: Car,             label: "My Vehicles",     path: "/owner/vehicles"         },
    { icon: Plus,            label: "Add Vehicle",     path: "/owner/vehicles/add"     },
    { icon: Calendar,        label: "Bookings",        path: "/owner/bookings"         },
    { icon: BarChart3,       label: "Analytics",       path: "/owner/analytics"        },
  ];

  const menu = isAdmin ? adminMenu : ownerMenu;
  const title = isAdmin ? "Admin Panel" : "Owner Panel";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-bg rounded-xl flex-center shadow-md">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text font-heading block leading-tight">
                RentiGo
              </span>
              <span className="text-[10px] text-secondary-500 uppercase font-medium tracking-wider">
                {title}
              </span>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;