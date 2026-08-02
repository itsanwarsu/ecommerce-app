import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
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
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(response.data.user)
    );


    const role = response.data.user.role;

    if (role === "superadmin") {
      navigate("/superadmin");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    Swal.fire({
  icon: "error",
  title: "Login Gagal",
  text:
    error.response?.data?.message ||
    error.message ||
    "Login Failed.",
  confirmButtonColor: "#dc2626", // merah
});
  
  }finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-[350px]"
      >

        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Login
        </h1>

<button
  type="button"
  onClick={() => {
    window.location.href =
      "https://backend-express-production-0c49.up.railway.app/api/auth/google";
  }}
  className="w-full mt-4 mb-4 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition"
>
 <FcGoogle size={22}
  />
  Login dengan Google
</button>

        {/* Email */}
        <div className="relative mb-4">
          <HiOutlineEnvelope className="absolute left-3 top-3 text-gray-400 text-xl" />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <HiOutlineLockClosed className="absolute left-3 top-3 text-gray-400 text-xl" />



          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
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
        <p className="text-center mt-5">
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
