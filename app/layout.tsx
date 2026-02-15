import type { Metadata } from "next";
import "@/styles/global.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Nexus Inventory",
  description: "Sistema de Gestão de Ativos de TI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
