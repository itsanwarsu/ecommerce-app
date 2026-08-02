import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  setToken: (token) => {
    localStorage.setItem("token", token);

    set({
      token,
      isAuthenticated: true,
    });
  },

  fetchProfile: async () => {
    try {
      const res = await api.get("/auth/profile");

      set({
        user: res.data.user,
        isAuthenticated: true,
      });

    } catch (err) {

      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
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
