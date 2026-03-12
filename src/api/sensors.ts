import { fetchJson } from "./http";
import type { SensorData } from "../types/SensorData";

export function getRecent(limit = 1) {
  return fetchJson<SensorData[]>(`/sensors/recent?limit=${limit}`);
}

export function getHistory(window: "1h" | "1d" | "7d", limit = 5000) {
  return fetchJson<SensorData[]>(
    `/sensors/history?window=${window}&limit=${limit}`
  );
}

export type SensorSummary = {
  window: "1h" | "1d" | "7d";
  count: number;
  temp_min: number | null;
  temp_max: number | null;
  temp_avg: number | null;
  occupied_count: number;
  empty_count: number;
  occupancy_rate: number;
};

export function getSummary(window: "1h" | "1d" | "7d") {
  return fetchJson<SensorSummary>(`/sensors/summary?window=${window}`);
}