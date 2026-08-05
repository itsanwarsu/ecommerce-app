import { Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import GoogleSuccess from "../pages/Auth/GoogleSuccess";

export default function AuthRoutes() {
  return (
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
    </Route>
  );
}
