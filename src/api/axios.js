import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-express-production-0c49.up.railway.app/api",
});

// Tambahkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
