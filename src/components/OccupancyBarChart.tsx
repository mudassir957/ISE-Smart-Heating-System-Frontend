import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SensorData } from "../types/SensorData";
import { useMemo } from "react";

export default function OccupancyBarChart({ data }: { data: SensorData[] }) {
  const formatted = useMemo(
    () =>
      (data ?? []).map((d) => ({
        ...d,
        time: new Date(d.timestamp).toLocaleString(),
      })),
    [data]
  );

  if (!formatted.length) return <p>No occupancy data for this range.</p>;

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted}>
          <XAxis dataKey="time" hide={false} />
          <YAxis domain={[0, 1]} allowDecimals={false} />
          <Tooltip
            formatter={(v) => (v === 1 ? "Occupied" : "Empty")}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar dataKey="occupancy" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}