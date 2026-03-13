import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SensorData } from "../types/SensorData";
import { useMemo } from "react";

export default function TemperatureLineChart({ data }: { data: SensorData[] }) {
  const formatted = useMemo(
    () =>
      (data ?? []).map((d) => ({
        ...d,
        time: new Date(d.timestamp).toLocaleString(),
      })),
    [data]
  );

  if (!formatted.length) return <p>No temperature data for this range.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <XAxis dataKey="time" hide={false} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" dot={false} stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}