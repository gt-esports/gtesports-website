import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin() {
  const { user, loading, isAdmin, authorizationError } = useAuth();

  if (loading) {
    return <p role="status" className="p-8 text-center text-gray-300">Checking access...</p>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (authorizationError) {
    return <p role="alert" className="p-8 text-center text-gray-300">{authorizationError}</p>;
  }
  if (!isAdmin) {
    return <p role="alert" className="p-8 text-center text-gray-300">You do not have access to this page.</p>;
  }

  return <Outlet />;
}
