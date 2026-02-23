import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    __handleUnauthorized?: () => void;
  }
}

export function useVerifyLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!accessToken && pathname !== "/login") {
      router.replace("/login");
    } else if (accessToken && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [accessToken, loading, router, pathname]);

  // Monitora logout em tempo real (quando recebe 401)
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      router.replace("/login");
    };

    window.__handleUnauthorized = handleUnauthorized;

    return () => {
      delete window.__handleUnauthorized;
    };
  }, [logout, router]);
}
