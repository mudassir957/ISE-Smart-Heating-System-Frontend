import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoadingUser } = useAuth();

  if (isLoadingUser) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
}