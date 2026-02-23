"use client";

import { useVerifyLogin } from "@/hooks/verifyLogin";

export default function AuthRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useVerifyLogin();
  return <>{children}</>;
}