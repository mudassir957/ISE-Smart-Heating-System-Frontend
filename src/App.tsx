import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LivePage from "./pages/LivePage";
import HistoryPage from "./pages/HistoryPage";
import PreferencesPage from "./pages/PreferencesPage";
import AdminPage from "./pages/AdminPage";

import { useEffect } from "react";
import { applyTheme } from "./theme/useTheme";
import { getMyPreferences } from "./api/users";

function AppShell({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  useEffect(() => {
    let alive = true;
    if (!token) {
      applyTheme("light");
      return;
    }
    (async () => {
      try {
        const prefs = await getMyPreferences(token);
        if (!alive) return;
        applyTheme(prefs.theme);
      } catch {
        // If preferences fail, keep light theme.
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/live" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/app/live"
            element={
              <ProtectedRoute>
                <AppShell>
                  <LivePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/history"
            element={
              <ProtectedRoute>
                <AppShell>
                  <HistoryPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/preferences"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PreferencesPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/admin"
            element={
              <AdminRoute>
                <AppShell>
                  <AdminPage />
                </AppShell>
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/app/live" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}