import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/User/Home";
import Cart from "./pages/User/Cart";
import Checkout from "./pages/User/Checkout";
import Success from "./pages/User/Success";
import Profile from "./pages/User/Profile";
import Chat from "./pages/User/Chat";
import ProductDetail from "./pages/User/ProductDetail";
import MyOrders from "./pages/User/MyOrders";
import Wishlist from "./pages/User/Wishlist";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import GoogleSuccess from "./pages/Auth/GoogleSuccess";

import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import AddProduct from "./pages/Admin/AddProduct";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import RoleRoute from "./components/protected/RoleRoute";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

import useCartStore from "./store/cartStore";
import useAuthStore from "./store/authStore";

export default function App() {
  const token = useAuthStore((state) => state.token);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    const initializeApp = async () => {
      if (!token) return;

      try {
        await fetchProfile();
        await loadCart();
      } catch (err) {
        console.error(err);
      }
    };

    initializeApp();
  }, [token, fetchProfile, loadCart]);

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/success" element={<Success />} />
      </Route>

      {/* ================= USER (LOGIN REQUIRED) ================= */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
      </Route>

      {/* ================= ADMIN / SUPERADMIN ================= */}
      <Route
        element={
          <RoleRoute roles={["admin", "superadmin"]}>
            <SuperAdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin/addproduct" element={<AddProduct />} />
      </Route>

      {/* ================= SUPERADMIN ONLY ================= */}
      <Route
        element={
          <RoleRoute role="superadmin">
            <SuperAdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
      </Route>
    </Routes>
  );
}
