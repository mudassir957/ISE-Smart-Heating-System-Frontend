import type { SensorData } from "../types/SensorData";

export default function LiveCards({ data }: { data: SensorData }) {
  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      <div>
        <h2>{data.temperature.toFixed(1)} °C</h2>
        <p>Temperature</p>
      </div>

      <div>
        <h2>{data.occupancy === 1 ? "Occupied" : "Empty"}</h2>
        <p>Room Status</p>
      </div>

      <div>
        <h2>{new Date(data.timestamp).toLocaleTimeString()}</h2>
        <p>Last Update</p>
      </div>
    </div>
  );
}