import { useEffect, useRef, useState } from "react";
import { getRecent } from "../api/sensors";
import type { SensorData } from "../types/SensorData";
import Page from "../components/Page";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { Thermometer, Home, Clock } from "lucide-react";

export default function LivePage() {
  const [latest, setLatest] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const lastIdRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const rec = await getRecent(1);
        if (!alive) return;

        const next = rec[0] ?? null;
        setLatest(next);
        setError(null);

        if (next && lastIdRef.current !== next.id) {
          lastIdRef.current = next.id;
          setPulseKey((k) => k + 1);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e.message ?? "Failed to fetch live data");
      }
    }

    tick();
    const id = setInterval(tick, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const occupied = latest?.occupancy === 1;

  return (
    <Page title="Live" subtitle="Real-time readings from your virtual sensors">
      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <motion.div
        key={pulseKey}
        initial={{ opacity: 0.7, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {latest ? `${latest.temperature.toFixed(1)}°C` : "—"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Current room temperature</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Room status</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-semibold">{latest ? (occupied ? "Occupied" : "Empty") : "—"}</div>
            {latest && <Badge variant={occupied ? "default" : "secondary"}>{occupied ? "1" : "0"}</Badge>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last update</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latest ? new Date(latest.timestamp).toLocaleTimeString() : "—"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {latest ? new Date(latest.timestamp).toLocaleDateString() : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hint</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your generator currently inserts data every ~2 seconds. Later, the admin panel can expose controls like pause/resume
            and sampling interval.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Backend reachable: <span className="font-medium text-foreground">{error ? "No" : "Yes"}</span>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}