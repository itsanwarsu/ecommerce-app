import { Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home";
import Cart from "./pages/User/Cart";
import Checkout from "./pages/User/Checkout";
import Success from "./pages/User/Success";
import Profile from "./pages/User/Profile";
import Chat from "./pages/User/Chat";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductDetail from "./pages/User/ProductDetail";
import MyOrders from "./pages/User/MyOrders";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import SuperAdminRoute from "./components/protected/SuperAdminRoute";
import AddProduct from "./pages/Admin/AddProduct";
import Wishlist from "./pages/User/Wishlist";
import useCartStore from "./store/cartStore";
import { useEffect } from "react";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";

// Perbaikan: Gunakan PascalCase untuk folder/file layout jika memungkinkan
import MainLayout from "./layouts/MainLayout"; 
import AuthLayout from "./layouts/AuthLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

export default function App() {
useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      useCartStore.getState().loadCart();
    }
  }, []);

  return (
     <Routes>
       {/* 1. LAYOUT UTAMA (Halaman Umum & Fitur Belanja) */}
      <Route element={<MainLayout />}>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      
        {/* Rute Semi-Publik / Privat (Bisa ditambahkan ProtectedRoute nanti) */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
      </Route>

<Route element={<SuperAdminLayout />}>
<Route  path="/superadmin" element={
              <SuperAdminRoute>
              <SuperAdmin />
              </SuperAdminRoute>
              } />
<Route path="/admin/addproduct" element={<AddProduct />} />
</Route>

      {/* 2. LAYOUT AUTENTIKASI (Login & Register) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
      </Route>
    </Routes>
 
 );
}

