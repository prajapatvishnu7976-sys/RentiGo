import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    clearError,
    isAdmin,
    isOwner,
    isCustomer,
  } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("rentigo_token");
    if (storedToken && !user) {
      fetchCurrentUser();
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    clearError,
    // 🔥 Direct boolean values (NOT function calls)
    isAdmin,
    isOwner,
    isCustomer,
  };
};

export default useAuth;