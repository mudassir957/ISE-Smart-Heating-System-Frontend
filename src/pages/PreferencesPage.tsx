import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import * as usersApi from "../api/users";
import Page from "../components/Page";
import { applyTheme } from "../theme/useTheme";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

export default function PreferencesPage() {
  const { token } = useAuth();
  const [prefs, setPrefs] = useState<usersApi.Preferences | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!token) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const p = await usersApi.getMyPreferences(token);
        if (!alive) return;
        setPrefs(p);
        applyTheme(p.theme);
      } catch (e: any) {
        if (!alive) return;
        setErr(e.message ?? "Failed to load preferences");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  async function savePatch(patch: usersApi.PreferencesPatch) {
    if (!token || !prefs) return;
    setSaving(true);
    setErr(null);
    try {
      const updated = await usersApi.updateMyPreferences(token, patch);
      setPrefs(updated);
      applyTheme(updated.theme);
    } catch (e: any) {
      setErr(e.message ?? "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page title="Preferences" subtitle="Personalize how the dashboard behaves and looks">
      {err && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {err}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading preferences…</p>
      ) : !prefs ? (
        <p className="text-sm text-muted-foreground">No preferences found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dashboard</CardTitle>
              {saving ? <Badge variant="secondary">Saving…</Badge> : <Badge variant="outline">Synced</Badge>}
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label>Default history range</Label>
                <Select
                  value={prefs.default_window}
                  onValueChange={(v) => savePatch({ default_window: v as any })}
                  disabled={saving}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last 1 hour</SelectItem>
                    <SelectItem value="1d">Last 1 day</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used as the default selection on the History page.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Live poll interval</Label>
                <Select
                  value={String(prefs.poll_ms)}
                  onValueChange={(v) => savePatch({ poll_ms: Number(v) })}
                  disabled={saving}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2000">2 seconds</SelectItem>
                    <SelectItem value="5000">5 seconds</SelectItem>
                    <SelectItem value="10000">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How often the Live page refreshes.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Theme</Label>
                <Select
                  value={prefs.theme}
                  onValueChange={(v) => savePatch({ theme: v as any })}
                  disabled={saving}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Applies instantly and is stored in your account preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Preferences are stored in the backend per user. That means they follow you across devices once you log in.
              <div className="mt-3">
                Next improvement: use poll interval here to drive Live polling automatically.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Page>
  );
}