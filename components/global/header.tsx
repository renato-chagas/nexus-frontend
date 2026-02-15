"use client";

import { usePathname } from "next/navigation";
import { GitBranch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="flex items-center justify-between p-2 px-8 shadow-sm">
      <div className="flex items-center gap-2">
        <GitBranch size={20} />
        <h2 className="text-lg">Nexus Inventory</h2>
      </div>
      <span className="text-sm">{pathname}</span>
      <span className="text-sm">
        {loading ? "Carregando..." : user?.username || "Não autenticado"}
      </span>
    </header>
  );
}

export default Header;
