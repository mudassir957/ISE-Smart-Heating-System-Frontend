import { fetchJson } from "./http";

export type TokenResponse = { access_token: string; token_type: "bearer" };

export type User = {
  id: number;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
};

export async function register(email: string, password: string) {
  return fetchJson<User>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

// FastAPI OAuth2PasswordRequestForm => x-www-form-urlencoded
export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  return fetchJson<TokenResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

export async function me(token: string) {
  return fetchJson<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}