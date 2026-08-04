import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,

  setToken: (token) => {
    localStorage.setItem("token", token);

    set({
      token,
      isAuthenticated: true,
    });
  },

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
    } catch (err) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
