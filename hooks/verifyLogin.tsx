import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useVerifyLogin() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/home");
    }
  }, [router]);
}
