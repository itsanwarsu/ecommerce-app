import { Routes } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <PublicRoutes />
      <ProtectedRoutes />
      <AdminRoutes />
      <AuthRoutes />
    </Routes>
  );
}
