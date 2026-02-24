"use client";

import { useState } from "react";
import { Input } from "../login/Input";
import { Button } from "../ui/button";

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <Input
        label="Email"
        placeholder="seu@email.com"
        type="email"
        value={email}
        onChange={setEmail}
        icon="mail"
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={setPassword}
        icon="lock"
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
