import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
} from "react-icons/hi2";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Semua data harus diisi!");
      return;
    }

    // Simpan ke localStorage (sementara)
const users = JSON.parse(localStorage.getItem("users")) || [];

const emailExists = users.some(
    (user) => user.email === email
  );

  if (emailExists) {
    alert("Email sudah terdaftar.");
    return;
}
const newUser = {
  name,
  email,
  password,
};


users.push(newUser);

localStorage.setItem("users", JSON.stringify(users));
    alert("Pendaftaran berhasil!");

    navigate("/login");
 } 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <form
        onSubmit={handleRegister}
        className="bg-white w-[360px] p-6 rounded-xl shadow-lg"
      >

        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Daftar Akun
        </h1>

        {/* Nama */}
        <div className="relative mb-4">
          <HiOutlineUser className="absolute left-3 top-3 text-xl text-gray-400" />

          <input
            type="text"
            placeholder="Nama Lengkap"
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
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Daftar
        </button>

        <p className="text-center mt-5 text-sm">
          Sudah punya akun?
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
