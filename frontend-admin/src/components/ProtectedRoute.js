import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import ROUTES from "../routes";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
