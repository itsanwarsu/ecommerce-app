import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { useState } from "react";
import useCartStore from "../../store/cartStore";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Email dan Password harus diisi!");
    return;
  }

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

await useCartStore.getState().loadCart();

    const role = response.data.user.role;

    if (role === "superadmin") {
      navigate("/superadmin");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message ||
      "Login gagal."
    );
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

        {/* Email */}
        <div className="relative mb-4">
          <HiOutlineEnvelope className="absolute left-3 top-3 text-gray-400 text-xl" />

          <input
            type="email"
            placeholder="Masukkan Email"
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
            placeholder="Masukkan Password"
            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center mt-5">
          Belum punya akun?
          <Link
            to="/register"
            className="text-green-600 font-semibold ml-2"
          >
            Daftar
          </Link>
        </p>

      </form>

    </div>
  );
}
