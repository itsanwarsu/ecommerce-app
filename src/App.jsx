import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Profile from "./pages/Profile/Profile";
import Transaction from "./pages/Transaction";
import Chat from "./pages/Chat";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductDetail from "./pages/ProductDetail";
import MyOrders from "./pages/Profile/MyOrders";


// Perbaikan: Gunakan PascalCase untuk folder/file layout jika memungkinkan
import MainLayout from "./layouts/MainLayout"; 
import AuthLayout from "./layouts/AuthLayout";

// Opsional: Jika Anda nanti membuat komponen pembatas akses login
// import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <Routes>
      {/* 1. LAYOUT UTAMA (Halaman Umum & Fitur Belanja) */}
      <Route element={<MainLayout />}>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Rute Semi-Publik / Privat (Bisa ditambahkan ProtectedRoute nanti) */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/orders" element={<MyOrders />} />
      </Route>

      {/* 2. LAYOUT AUTENTIKASI (Login & Register) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

