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
            isAuthenticated: true,
            loading: false,
          });

          return res.data.user;
        } catch (err) {
          console.error("fetchProfile failed:", err);

          // hanya logout paksa kalau token memang invalid/expired
          if (err.response?.status === 401) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
            });
          } else {
            set({ loading: false });
          }

          return null;
        }
      },

      // Logout
      logout: () => {
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
