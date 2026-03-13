import { useEffect, useMemo, useState } from "react";
import type { SensorData } from "../types/SensorData";
import { getHistory, getSummary, type SensorSummary } from "../api/sensors";
import Page from "../components/Page";
import RangeSelector from "../components/RangeSelector";

import TemperatureLineChart from "../components/TemperatureLineChart";
import OccupancyBarChart from "../components/OccupancyBarChart";
import OccupancyPieChart from "../components/OccupancyPieChart";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Thermometer, TrendingUp, Users, Database } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { getMyPreferences, type Preferences } from "../api/users";

type Window = "1h" | "1d" | "7d";

function fmt(n: number | null | undefined, digits = 1) {
  if (n === null || n === undefined) return "—";
  return n.toFixed(digits);
}

export default function HistoryPage() {
  const { token } = useAuth();
  const [window, setWindow] = useState<Window>("1h");
  const [history, setHistory] = useState<SensorData[]>([]);
  const [summary, setSummary] = useState<SensorSummary | null>(null);
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getMyPreferences(token).then(setPrefs).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (prefs) setWindow(prefs.default_window);
  }, [prefs]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    Promise.all([getHistory(window), getSummary(window)])
      .then(([h, s]) => {
        if (!alive) return;
        setHistory(h);
        setSummary(s);
      })
      .catch((e: any) => {
        if (!alive) return;
        setErr(e.message ?? "Failed to fetch history");
        setHistory([]);
        setSummary(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [window]);

  const occupancyPct = useMemo(() => {
    if (!summary || summary.count === 0) return "—";
    return `${Math.round(summary.occupancy_rate * 100)}%`;
  }, [summary]);

  return (
    <Page title="History" subtitle="Explore temperature & occupancy trends">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <RangeSelector value={window} onChange={setWindow} />
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {err}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Samples</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{summary?.count ?? "—"}</div>
                <p className="mt-1 text-xs text-muted-foreground">Records in range</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg temp</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{fmt(summary?.temp_avg)}°C</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Min {fmt(summary?.temp_min)}°C · Max {fmt(summary?.temp_max)}°C
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">{occupancyPct}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Occupied {summary?.occupied_count ?? "—"} · Empty {summary?.empty_count ?? "—"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {history.length >= 2
                    ? `${(history[history.length - 1].temperature - history[0].temperature).toFixed(1)}°C`
                    : "—"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Change over selected range</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <TemperatureLineChart data={history} />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Occupancy timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <OccupancyBarChart data={history} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Occupancy distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <OccupancyPieChart data={history} />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}