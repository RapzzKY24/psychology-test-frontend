import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client (ADR-009: version must match the backend exactly — 1.7.2).
 * Goes through the same-origin proxy: `/api/v1/auth` == backend basePath.
 */
export const authClient = createAuthClient({
  baseURL: "/api/v1/auth",
});

export const { useSession } = authClient;
