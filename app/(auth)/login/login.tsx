"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/forms";
import { DEFAULT_API_HEADERS } from "@/constants/api";

export function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: DEFAULT_API_HEADERS,
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access) {
        login(data.access, data.refresh || "");
        router.push("/dashboard");
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-8">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col items-center w-full max-w-md pb-10">
        <div className="flex flex-col items-center mt-8 mb-4">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg">
            <Package className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-blue-600">Nexus Inventory</h2>
          <h1 className="text-xl font-bold mt-2">Bem-Vindo de volta!</h1>
          <p className="text-gray-500 text-sm text-center px-4">
            Entre com as suas credenciais para acessar o sistema
          </p>
        </div>

        <div className="w-full px-4">
          {error && (
            <p className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          <LoginForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Login;