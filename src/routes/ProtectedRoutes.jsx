import { Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/protected/ProtectedRoute";

import Cart from "../pages/User/Cart";
import Wishlist from "../pages/User/Wishlist";
import Chat from "../pages/User/Chat";
import Checkout from "../pages/User/Checkout";
import Profile from "../pages/User/Profile";
import MyOrders from "../pages/User/MyOrders";

export default function ProtectedRoutes() {
  return (
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
  );
}
