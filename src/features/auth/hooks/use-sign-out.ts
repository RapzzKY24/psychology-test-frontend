"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authClient } from "@/lib/api/auth-client";

/** Idempotent: safe even when the session cookie is already gone. */
export function useSignOut(): () => void {
  const router = useRouter();
  return useCallback(() => {
    void authClient.signOut().then(() => {
      router.replace("/");
      router.refresh();
    });
  }, [router]);
}
