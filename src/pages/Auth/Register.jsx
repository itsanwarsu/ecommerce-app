import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import api from "../../api/axios";
import Swal from "sweetalert2"

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleRegister = async (e) => {
  e.preventDefault();

  if (!name || !email || !password) {
 Swal.fire({
  icon: "warning",
  title: "Oops...",
  text: "Email And Password Must Be Filled!",
  confirmButtonColor: "#16a34a", // hijau
});

return;
  }

setLoading(true);
  try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      }
    );

  await Swal.fire({
  title: "Berhasil!",
  text: response.data.message,
  icon: "success",
  confirmButtonText: "OK",
});

navigate("/login");
  } catch (error) {
Swal.fire({
  title: "Registration Failed",
  text:
    error.response?.data?.message ||
    error.message ||
    "Registration Failed.",
  icon: "error",
  confirmButtonText: "OK",
});
  }finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleRegister}
        className="bg-white w-[360px] p-6 rounded-xl shadow-lg"
      >

        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Account Regisration
        </h1>

        {/* Nama */}
        <div className="relative mb-4">
          <HiOutlineUser className="absolute left-3 top-3 text-xl text-gray-400" />

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <HiOutlineEnvelope className="absolute left-3 top-3 text-xl text-gray-400" />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <HiOutlineLockClosed className="absolute left-3 top-3 text-xl text-gray-400" />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

<button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
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
    "Register"
  )}
</button>
        <p className="text-center mt-5 text-sm">
          Already Have Account?
          <Link
            to="/login"
            className="text-green-600 font-semibold ml-1"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}
