import { fetchJson } from "./http";
import type { User } from "./auth";

export function listUsers(token: string) {
  return fetchJson<User[]>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function setUserRole(token: string, userId: number, role: "user" | "admin") {
  return fetchJson<User>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });
}