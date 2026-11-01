import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Exige rol admin.
// Visitante → /login · Cliente → /403 (tiene sesión pero no permiso)
function AdminRoute() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
