const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export function getBaseUrl() {
  return BASE_URL;
}

export async function fetchJson<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, opts);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Try to show FastAPI error detail if present
    try {
      const j = text ? JSON.parse(text) : null;
      if (j?.detail) throw new Error(typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail));
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(text || `Request failed ${res.status}`);
  }

  // 204 no content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}