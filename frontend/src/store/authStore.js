import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 🔥 Boolean role helpers (computed from user)
      isAdmin: false,
      isOwner: false,
      isCustomer: false,

      // ─── Helper: Update role booleans ─────────
      _updateRoles: (user) => {
        return {
          isAdmin: user?.role === "admin",
          isOwner: user?.role === "owner",
          isCustomer: user?.role === "customer",
        };
      },

      // ─── Register ──────────────────────────────
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { token, data } = response;

          localStorage.setItem("rentigo_token", token);
          localStorage.setItem("rentigo_user", JSON.stringify(data.user));

          const roles = get()._updateRoles(data.user);

          set({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            ...roles,
          });

          console.log("✅ Register success:", data.user);
          return { success: true, message: response.message, user: data.user };
        } catch (error) {
          console.error("❌ Register error:", error);
          const message = error.response?.data?.message || "Registration failed";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Login ─────────────────────────────────
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const { token, data } = response;

          localStorage.setItem("rentigo_token", token);
          localStorage.setItem("rentigo_user", JSON.stringify(data.user));

          const roles = get()._updateRoles(data.user);

          set({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            ...roles,
          });

          console.log("✅ Login success:", data.user);
          return { success: true, message: response.message, user: data.user };
        } catch (error) {
          console.error("❌ Login error:", error);
          const message = error.response?.data?.message || "Login failed";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Logout ────────────────────────────────
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("rentigo_token");
          localStorage.removeItem("rentigo_user");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            isAdmin: false,
            isOwner: false,
            isCustomer: false,
          });
        }
      },

      // ─── Fetch Current User ────────────────────
      fetchCurrentUser: async () => {
        const token = localStorage.getItem("rentigo_token");
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authService.getMe();
          const user = response.data.user;
          const roles = get()._updateRoles(user);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            ...roles,
          });

          console.log("✅ User restored:", user);
        } catch (error) {
          console.error("❌ Fetch user error:", error);
          localStorage.removeItem("rentigo_token");
          localStorage.removeItem("rentigo_user");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
            isOwner: false,
            isCustomer: false,
          });
        }
      },

      // ─── Update Profile ────────────────────────
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.updateProfile(data);
          const user = response.data.user;
          const roles = get()._updateRoles(user);

          localStorage.setItem("rentigo_user", JSON.stringify(user));
          set({
            user,
            isLoading: false,
            ...roles,
          });
          return { success: true, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || "Update failed";
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // ─── Change Password ───────────────────────
      changePassword: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.changePassword(data);
          set({ isLoading: false });
          return { success: true, message: response.message };
        } catch (error) {
          const message = error.response?.data?.message || "Password change failed";
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // ─── Clear Error ───────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: "rentigo-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isOwner: state.isOwner,
        isCustomer: state.isCustomer,
      }),
      // 🔥 On rehydration, update role booleans
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.isAdmin = state.user.role === "admin";
          state.isOwner = state.user.role === "owner";
          state.isCustomer = state.user.role === "customer";
          console.log("♻️ Auth rehydrated:", state.user.name, "as", state.user.role);
        }
      },
    }
  )
);

export default useAuthStore;