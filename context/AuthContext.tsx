"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/httpClient";
import { AUTH_ENDPOINTS } from "@/constants/api";
import { AuthContextType, User, AuthResponse, TokenRefreshResponse } from "@/types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    router.push("/login");
  };

  const fetchUser = async (token: string) => {
    try {
      const data = await apiCall("/users/me/", {}, token, logout);
      setUser(data || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const res: TokenRefreshResponse = await apiCall("/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res?.access) {
        localStorage.setItem("access_token", res.access);
        setAccessToken(res.access);
        return true;
      }
      logout();
      return false;
    } catch {
      logout();
      return false;
    }
  };

  const login = (newAccessToken: string, newRefreshToken: string) => {
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    fetchUser(newAccessToken);
  };

  useEffect(() => {
    if (accessToken) fetchUser(accessToken);
    else setLoading(false);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}