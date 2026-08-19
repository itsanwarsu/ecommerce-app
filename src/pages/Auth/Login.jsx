import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import Swal from "sweetalert2";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

const handleGoogleLogin = () => {
  setGoogleLoading(true);

  setTimeout(() => {
    window.location.href =
      "https://backend-express-production-a93b.up.railway.app/api/auth/google";
  }, 300);
};

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Email dan password wajib diisi!",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // Simpan token ke Zustand + localStorage
      setToken(data.token);

      // Arahkan berdasarkan role.
      // App.jsx akan otomatis memanggil fetchProfile() dan loadCart().
      switch (data.user.role) {
        case "superadmin":
          navigate("/superadmin", { replace: true });
          break;

        case "admin":
          navigate("/admin", { replace: true });
          break;

        default:
          navigate("/", { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text:
          error.response?.data?.message ||
          "Email atau password salah.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-[350px]"
      >
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Login
        </h1>

<button
  type="button"
  onClick={handleGoogleLogin}
  disabled={googleLoading}
  className={`w-full mb-4 flex items-center justify-center gap-3 rounded-lg py-3 border transition-all duration-300 ${
    googleLoading
      ? "bg-gray-100 dark:bg-gray-700 dark:text-white border-gray-300 cursor-not-allowed scale-95"
      : "bg-white dark:bg-gray-700 dark:text-white border-gray-300 hover:bg-gray-50 active:scale-95 hover:shadow-md"
  }`}
>
  {googleLoading ? (
    <>
      <svg
        className="w-5 h-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>

      Menghubungkan...
    </>
  ) : (
    <>
      <FcGoogle size={22} />
      Login dengan Google
    </>
  )}
</button>

        <div className="relative mb-4 ">
          <HiOutlineEnvelope className="absolute left-3 top-3 text-gray-400 dark:text-white text-xl" />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full dark:bg-gray-700 dark:text-white border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-6">
          <HiOutlineLockClosed className="absolute dark:text-white left-3 top-3 text-gray-400 text-xl" />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full dark:bg-gray-700 dark:text-white border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            loading
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center mt-5 dark:text-white">
          Don't Have An Account Yet?
          <Link
            to="/register"
            className="text-green-600 font-semibold ml-2"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
