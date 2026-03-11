import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Thermometer, Activity, Settings, Shield, LogOut } from "lucide-react";

function TabLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        ].join(" ")
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-4">Smart Heating</div>
            <div className="text-xs text-muted-foreground">Dashboard</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <TabLink to="/app/live" icon={<Activity className="h-4 w-4" />} label="Live" />
          <TabLink to="/app/history" icon={<Thermometer className="h-4 w-4" />} label="History" />
          <TabLink to="/app/preferences" icon={<Settings className="h-4 w-4" />} label="Preferences" />
          {user?.role === "admin" && (
            <TabLink to="/app/admin" icon={<Shield className="h-4 w-4" />} label="Admin" />
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden flex-col items-end md:flex">
              <div className="text-sm font-medium">{user.email}</div>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
              </div>
            </div>
          )}

          <Separator orientation="vertical" className="hidden h-8 md:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              nav("/login");
            }}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* mobile nav */}
      <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-3 md:hidden">
        <TabLink to="/app/live" icon={<Activity className="h-4 w-4" />} label="Live" />
        <TabLink to="/app/history" icon={<Thermometer className="h-4 w-4" />} label="History" />
        <TabLink to="/app/preferences" icon={<Settings className="h-4 w-4" />} label="Prefs" />
        {user?.role === "admin" && <TabLink to="/app/admin" icon={<Shield className="h-4 w-4" />} label="Admin" />}
      </div>
    </div>
  );
}