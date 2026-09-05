import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client (ADR-009: version must match the backend exactly — 1.7.2).
 * Goes through the same-origin proxy: `/api/v1/auth` == backend basePath.
 *
 * The library validates `baseURL` via `new URL()` — a relative path throws, so
 * resolve an absolute one. In the browser that is the current origin (same-origin
 * proxy, ADR-010). During SSR the module still evaluates, but authClient is only
 * ever invoked from event handlers — never fetched server-side — so the internal
 * backend URL there is just a valid placeholder.
 */
const authBaseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/v1/auth`
    : `${process.env.API_INTERNAL_URL ?? "http://localhost:4000"}/api/v1/auth`;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});

export const { useSession } = authClient;
