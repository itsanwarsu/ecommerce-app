import { Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/User/Home";
import ProductDetail from "../pages/User/ProductDetail";
import Success from "../pages/User/Success";

export default function PublicRoutes() {
  return (
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/success" element={<Success />} />
    </Route>
  );
}
