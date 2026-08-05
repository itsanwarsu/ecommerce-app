import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Simpan token
      setToken: (token) => {
        localStorage.setItem("token", token);

        set({
          token,
          isAuthenticated: true,
        });
      },

      // Ambil profil user
      fetchProfile: async () => {
        try {
          set({ loading: true });

          const res = await api.get("/auth/profile");

          set({
            user: res.data.user,
            token: localStorage.getItem("token"),
            isAuthenticated: true,
            loading: false,
          });

          return res.data.user;
        } catch (err) {
          localStorage.removeItem("token");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });

          return null;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
