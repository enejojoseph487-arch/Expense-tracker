import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homePath } from "../utils";

// <ProtectedRoute roles={["admin"]}> only lets those roles in
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePath(user)} replace />;
  }
  return children;
}
