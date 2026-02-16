"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  id?: number;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Função para renovar token
  const refreshAccessToken = useCallback(
    async (currentRefreshToken: string): Promise<string | null> => {
      if (!currentRefreshToken) {
        return null;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: currentRefreshToken }),
        });

        const data = await res.json();

        if (res.ok && data.access) {
          localStorage.setItem("access_token", data.access);
          setAccessToken(data.access);
          console.log("[Auth] Token renovado com sucesso");
          return data.access;
        } else {
          console.error("[Auth] Falha ao renovar token:", data);
          logout();
          return null;
        }
      } catch (error) {
        console.error("[Auth] Erro ao renovar token:", error);
        logout();
        return null;
      }
    },
    [],
  );

  const fetchUser = useCallback(
    async (token: string, refresh: string) => {
     
      try {
        const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.warn("[Auth] Token expirado (401), tentando renovar token");

          if (refresh) {
            const newToken = await refreshAccessToken(refresh);
            if (newToken) {
              console.log("[Auth] Retentando fetch com novo token");
              return fetchUser(newToken, refresh);
            }
          } else {
            console.error("[Auth] Nenhum refresh token disponível");
          }

          setUser(null);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          console.error(
            "[Auth] Erro ao buscar usuário:",
            res.status,
            res.statusText,
          );
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("[Auth] Resposta completa do servidor:", data);
        console.log("[Auth] Usuário carregado");
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("[Auth] Erro na requisição:", error);
        setUser(null);
        setLoading(false);
      }
    },
    [refreshAccessToken],
  );

  useEffect(() => {
    console.log("[Auth] Inicializando contexto de autenticação");
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");

    if (storedAccessToken && storedRefreshToken) {
      console.log("[Auth] Tokens encontrados no localStorage");
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchUser(storedAccessToken, storedRefreshToken);
    } else {
      console.log("[Auth] Nenhum token encontrado");
      setLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(
    (newAccessToken: string, newRefreshToken: string) => {
      console.log("[Auth] Login realizado");
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      fetchUser(newAccessToken, newRefreshToken);
    },
    [fetchUser],
  );

  const logout = useCallback(() => {
    console.log("[Auth] Logout realizado");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken: () =>
          refreshAccessToken(refreshToken || "").then((token) => !!token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
