import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("secret123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-0px)] bg-muted/30">
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {err && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {err}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
              />
            </div>

            <Button
              disabled={loading}
              onClick={async () => {
                setErr(null);
                setLoading(true);
                console.log("button clicked");
                try {
                  console.log("2. Before login()");
                  await login(email, password);
                  console.log("3. After login(), before nav()");
                  nav("/app/live");
                  console.log("4. After nav()");
                } catch (e: any) {
                  setErr(e.message ?? "Login failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Logging in…" : "Login"}
            </Button>

            <p className="text-sm text-muted-foreground">
              No account?{" "}
              <Link
                to="/register"
                className="text-foreground underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
