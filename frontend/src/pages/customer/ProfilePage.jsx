import React, { useState } from "react";
import { User, Mail, Phone, Lock, Building, Save } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getInitials } from "../../utils/helpers";
import { validatePassword } from "../../utils/validators";

const ProfilePage = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    businessName: user?.businessName || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileData);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    const pwErrors = validatePassword(passwordData.newPassword);
    if (pwErrors.length > 0) {
      toast.error(pwErrors.join(", "));
      return;
    }

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      toast.success(result.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="container-app py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">
          My <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-secondary-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left - Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6 text-center sticky top-24">
            <div className="w-24 h-24 gradient-bg rounded-2xl mx-auto flex-center text-white font-bold text-3xl shadow-lg mb-4">
              {getInitials(user?.name)}
            </div>
            <h2 className="font-bold text-xl mb-1">{user?.name}</h2>
            <p className="text-sm text-secondary-500 mb-3">{user?.email}</p>
            <span className="badge-primary capitalize">{user?.role}</span>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "password"
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right - Forms */}
        <div className="md:col-span-2">
          {activeTab === "profile" && (
            <div className="card p-6">
              <h3 className="font-semibold text-xl mb-6">Personal Information</h3>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  icon={User}
                  required
                />

                <Input
                  label="Email"
                  value={user?.email}
                  icon={Mail}
                  disabled
                  helperText="Email cannot be changed"
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  icon={Phone}
                  maxLength={10}
                  required
                />

                {user?.role === "owner" && (
                  <Input
                    label="Business Name"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        businessName: e.target.value,
                      })
                    }
                    icon={Building}
                  />
                )}

                <Button type="submit" icon={Save} isLoading={isLoading}>
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="card p-6">
              <h3 className="font-semibold text-xl mb-6">Change Password</h3>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  icon={Lock}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  icon={Lock}
                  helperText="At least 6 chars, 1 upper, 1 lower, 1 number"
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  icon={Lock}
                  required
                />

                <Button type="submit" icon={Save} isLoading={isLoading}>
                  Update Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;