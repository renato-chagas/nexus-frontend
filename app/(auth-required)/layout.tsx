"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, loading]);

  if (loading) return null;

  return <>{children}</>;
}