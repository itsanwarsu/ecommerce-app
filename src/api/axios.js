import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "https://backend-express-production-9a2e.up.railway.app/api",
});

// Tambahkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
