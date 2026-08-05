import { Route } from "react-router-dom";

import RoleRoute from "../components/protected/RoleRoute";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import AddProduct from "../pages/Admin/AddProduct";
import SuperAdmin from "../pages/SuperAdmin/SuperAdmin";

export default function AdminRoutes() {
  return (
    <>
      <Route
        element={
          <RoleRoute roles={["admin", "superadmin"]}>
            <SuperAdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin/addproduct" element={<AddProduct />} />
      </Route>

      <Route
        element={
          <RoleRoute role="superadmin">
            <SuperAdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Route>
    </>
  );
}
