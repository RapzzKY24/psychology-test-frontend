import type { UserRole } from "@/lib/api/types";

/** Landing route per role after sign-in. Unknown roles fall back to /dashboard. */
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  PSYCHOLOGIST: "/psikolog",
  PARTICIPANT: "/dashboard",
  INSTANSI: "/instansi",
};

export function roleHome(role: string): string {
  return ROLE_HOME[role as UserRole] ?? "/dashboard";
}

/**
 * Post-login target: safe ?next= wins, otherwise the role home.
 * Single source for client (sign-in hook) and server (auth pages).
 */
export function postLoginTarget(next?: string | null, role?: string): string {
  return resolveSafeNext(next) ?? roleHome(role ?? "");
}

/**
 * Open-redirect guard for ?next=: only internal paths survive. Rejects empty,
 * relative, scheme-based, protocol-relative, backslash tricks, and the auth
 * pages themselves (redirect loop).
 */
export function resolveSafeNext(raw?: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return null;
  }
  if (raw === "/masuk" || raw === "/daftar") {
    return null;
  }
  return raw;
}
