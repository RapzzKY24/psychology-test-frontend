import type { UserRole } from "@/lib/api/types";

/** Landing route per role after sign-in. Unknown roles fall back to /dashboard. */
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  PSYCHOLOGIST: "/psikolog",
  PARTICIPANT: "/dashboard",
};

export function roleHome(role: string): string {
  return ROLE_HOME[role as UserRole] ?? "/dashboard";
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
