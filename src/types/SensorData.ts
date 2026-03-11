export interface SensorData {
  id: number;
  temperature: number;
  occupancy: 0 | 1;
  timestamp: string; // ISO from FastAPI
}