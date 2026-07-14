import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { useState } from "react";
import useCartStore from "../../store/cartStore";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

function handleLogin(e) {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    useCartStore.getState().loadUserData();
    navigate("/");
  } else {
    alert("Email atau Password salah");
  }
}

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
