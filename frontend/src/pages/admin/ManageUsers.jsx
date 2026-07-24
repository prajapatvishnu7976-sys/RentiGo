import React, { useEffect, useState } from "react";
import { Users, Trash2, ToggleLeft, ToggleRight, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import useAdminStore from "../../store/adminStore";
import SearchBar from "../../components/common/SearchBar";
import { CardSkeleton } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getInitials, formatDate } from "../../utils/helpers";

const ManageUsers = () => {
  const {
    users, pagination, isLoading,
    fetchAllUsers, updateUserStatus, deleteUser,
  } = useAdminStore();

  const [filter, setFilter] = useState({
    role: "",
    search: "",
    isActive: "",
    page: 1,
    limit: 10,
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchAllUsers(filter);
  }, [filter]);

  const handleToggleStatus = async (user) => {
    const result = await updateUserStatus(user._id, !user.isActive);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const result = await deleteUser(confirmDelete._id);
    if (result.success) {
      toast.success(result.message);
      setConfirmDelete(null);
    } else {
      toast.error(result.message);
    }
  };

  const roleFilters = [
    { value: "",         label: "All Users" },
    { value: "customer", label: "Customers" },
    { value: "owner",    label: "Owners"    },
    { value: "admin",    label: "Admins"    },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Users 👥</h1>
          <p className="page-subtitle">
            {pagination?.totalItems || 0} registered users
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 space-y-3">
        <SearchBar
          placeholder="Search by name, email, or phone..."
          onSearch={(value) => setFilter({ ...filter, search: value, page: 1 })}
        />

        <div className="flex flex-wrap gap-2">
          {roleFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter({ ...filter, role: f.value, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter.role === f.value
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={3} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your filters"
        />
      ) : (
        <>
          {/* Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-lg flex-center text-white font-semibold text-sm">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900">
                            {u.name}
                          </p>
                          {u.businessName && (
                            <p className="text-xs text-secondary-500">
                              {u.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </p>
                        <p className="text-xs flex items-center gap-1 text-secondary-500">
                          <Phone className="w-3 h-3" />
                          +91 {u.phone}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-600"
                            : u.role === "owner"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-success-50 text-success-600"
                        }`}
                      >
                        {u.role === "admin" ? "👑" : u.role === "owner" ? "🏢" : "👤"} {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.isActive
                            ? "bg-success-50 text-success-600"
                            : "bg-danger-50 text-danger-500"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <p className="text-xs text-secondary-600">
                        {formatDate(u.createdAt)}
                      </p>
                    </td>
                    <td>
                      <span className="font-semibold text-secondary-700">
                        {u.totalBookings || 0}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {u.role !== "admin" && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              title={u.isActive ? "Deactivate" : "Activate"}
                            >
                              {u.isActive ? (
                                <ToggleRight className="w-5 h-5 text-success-500" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-secondary-400" />
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u)}
                              className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-danger-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilter({ ...filter, page })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete User?"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This cannot be undone.`}
        variant="danger"
        confirmText="Delete User"
      />
    </div>
  );
};

export default ManageUsers;