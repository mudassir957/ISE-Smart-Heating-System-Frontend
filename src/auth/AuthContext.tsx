import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

type AuthContextValue = {
  user: authApi.User | null;
  token: string | null;
  isLoadingUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const LS_TOKEN = "shs_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<authApi.User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  async function refreshMeWithToken(accessToken: string) {
    const u = await authApi.me(accessToken);
    setUser(u);
  }

  async function refreshMe() {
    if (!token) {
      setUser(null);
      return;
    }
    await refreshMeWithToken(token);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoadingUser(true);

      try {
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }

        const u = await authApi.me(token);
        if (!cancelled) setUser(u);
      } catch (err) {
        console.error("Failed to load current user:", err);
        localStorage.removeItem(LS_TOKEN);
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoadingUser(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoadingUser,

      login: async (email, password) => {
        setIsLoadingUser(true);
        try {
          const t = await authApi.login(email, password);
          localStorage.setItem(LS_TOKEN, t.access_token);
          setToken(t.access_token);

          // Load user immediately so protected pages have state ready
          await refreshMeWithToken(t.access_token);
        } catch (err) {
          localStorage.removeItem(LS_TOKEN);
          setToken(null);
          setUser(null);
          throw err;
        } finally {
          setIsLoadingUser(false);
        }
      },

      register: async (email, password) => {
        setIsLoadingUser(true);
        try {
          await authApi.register(email, password);

          const t = await authApi.login(email, password);
          localStorage.setItem(LS_TOKEN, t.access_token);
          setToken(t.access_token);

          await refreshMeWithToken(t.access_token);
        } catch (err) {
          localStorage.removeItem(LS_TOKEN);
          setToken(null);
          setUser(null);
          throw err;
        } finally {
          setIsLoadingUser(false);
        }
      },

      logout: () => {
        localStorage.removeItem(LS_TOKEN);
        setToken(null);
        setUser(null);
      },

      refreshMe,
    }),
    [user, token, isLoadingUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}