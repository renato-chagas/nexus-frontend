import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useVerifyLogin() {
  const router = useRouter();
  const { accessToken, loading } = useAuth();

  useEffect(() => {
    // Se terminou de carregar e não há token, redireciona para login
    if (!loading && !accessToken) {
      router.replace("/login");
    }
    // Se há token, redireciona para dashboard (usuário já logado)
    else if (!loading && accessToken) {
      router.replace("/dashboard");
    }
  }, [accessToken, loading, router]);
}
