import type { SensorData } from "../types/SensorData";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getRecent(limit = 1) {
  return fetchJson<SensorData[]>(`${BASE_URL}/sensors/recent?limit=${limit}`);
}

export function getHistory(window: "1h" | "1d" | "7d", limit = 5000) {
  return fetchJson<SensorData[]>(
    `${BASE_URL}/sensors/history?window=${window}&limit=${limit}`
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
  occupancy_rate: number; // 0..1
};

export function getSummary(window: "1h" | "1d" | "7d") {
  return fetchJson<SensorSummary>(`${BASE_URL}/sensors/summary?window=${window}`);
}