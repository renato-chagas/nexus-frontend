"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Package, Mail, Lock } from "lucide-react";

import LoginInput from "@/components/login/input";

import { useVerifyLogin } from "@/hooks/verifyLogin";

export function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useVerifyLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/.", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.access) {
        localStorage.setItem("access_token", data.access);
        router.push("/home");
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-8">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col items-center w-full max-w-md pb-10 ">
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

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-stretch w-full px-4"
        >
          <LoginInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            icon="mail"
          />

          <LoginInput
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            icon="lock"
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />

          {error && (
            <p className="text-red-500 text-xs italic text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
