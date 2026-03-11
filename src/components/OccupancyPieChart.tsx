import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { SensorData } from "../types/SensorData";

export default function OccupancyPieChart({ data }: { data: SensorData[] }) {
  const occupied = (data ?? []).filter((d) => d.occupancy === 1).length;
  const empty = (data ?? []).length - occupied;

  if (!data?.length) return <p>No occupancy data for this range.</p>;

  const pieData = [
    { name: "Occupied", value: occupied },
    { name: "Empty", value: empty },
  ];

  return (
    <>
      <h3>Occupancy Distribution</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100}>
              <Cell fill="#4caf50" />
              <Cell fill="#f44336" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}