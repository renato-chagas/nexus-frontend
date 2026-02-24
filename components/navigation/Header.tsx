"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GitBranch, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-2 px-8 shadow-sm">
      <div className="flex items-center gap-2">
        <GitBranch size={20} />
        <h2 className="text-lg">Nexus Inventory</h2>
      </div>
      <span className="text-sm">{pathname}</span>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-sm hover:text-blue-600 px-6 py-1 cursor-pointer flex items-center gap-2 bg-gray-100 rounded-lg transition"
        >
          {loading ? "Carregando..." : user?.username || "Não autenticado"}
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-6 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
