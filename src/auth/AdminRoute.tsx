import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, user, isLoadingUser } = useAuth();

  if (isLoadingUser) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!token) return <Navigate to="/login" replace />;
  if (user && user.role !== "admin") return <Navigate to="/app/live" replace />;

  return <>{children}</>;
}