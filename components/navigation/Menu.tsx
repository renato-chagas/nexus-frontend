"use client";

import {
  Box,
  LayoutDashboard,
  Users,
  Tag,
  Book,
  History,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      router: "/dashboard",
    },
    {
      icon: Box,
      label: "Ativos",
      router: "/ativos",
    },
    {
      icon: Users,
      label: "Funcionarios",
      router: "/funcionarios",
    },
    {
      icon: Tag,
      label: "Categorias",
      router: "/categorias",
    },
    {
      icon: Book,
      label: "Softwares",
      router: "/softwares",
    },
    {
      icon: History,
      label: "Historico",
      router: "/historico",
    },
  ];

  return (
    <aside
      className="flex flex-col items-center w-[240px] max-w-[240px] h-full bg-gray-200"
      style={{ boxShadow: "0 -0px 6px -1px rgba(0,0,0,0.1)" }}
    >
      <div className="flex flex-col items-center w-full h-full p-6 gap-4 ">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.router;
          return (
            <Link
              key={idx}
              href={item.router}
              className={`flex items-center gap-2 p-2 w-full rounded-sm  border-gray-400 transition-colors ${
                isActive ? "bg-blue-200 text-blue-600" : "hover:bg-gray-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <h2 className="text-sm font-light">{item.label}</h2>
            </Link>
          );
        })}
      </div>
      <div
        className="p-6 bottom-0 w-full text-gray-500 border-gray-400"
        style={{ boxShadow: "-4px 0px 6px -1px rgba(0,0,0,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="" size={16} />
          <h2 className="text-[12px]">Nexus Inventory</h2>
          <h2 className="text-[12px]">v1.0</h2>
        </div>
        <div className="text-xs flex items-center gap-1">
          <h2 className="text-[12px]">©</h2>
          <h2>2026</h2>
        </div>
      </div>
    </aside>
  );
}

export default Menu;
