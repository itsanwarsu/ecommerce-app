import { Navigate } from "react-router-dom";

export default function SuperAdminRoute({children}) {

  const user = JSON.parse(
    localStorage.getItem("currentUser")
  );


  if (!user || user.role !== "superadmin") {
    return <Navigate to="/" />;
  }


  return children;
}
