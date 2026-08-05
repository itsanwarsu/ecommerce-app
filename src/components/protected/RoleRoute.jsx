import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function RoleRoute({
  children,
  role,
  roles,
}) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memuat...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Mendukung role tunggal maupun banyak role
  const allowedRoles = roles || (role ? [role] : []);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
