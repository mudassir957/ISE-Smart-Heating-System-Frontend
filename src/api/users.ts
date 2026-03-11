import { fetchJson } from "./http";

export type Preferences = {
  default_window: "1h" | "1d" | "7d";
  poll_ms: number;
  theme: "light" | "dark";
};

export type PreferencesPatch = Partial<Preferences>;

export function getMyPreferences(token: string) {
  return fetchJson<Preferences>("/users/me/preferences", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateMyPreferences(token: string, patch: PreferencesPatch) {
  return fetchJson<Preferences>("/users/me/preferences", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });
}