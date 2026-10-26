import { cache } from "react";
import { cookies } from "next/headers";
import { parseErrorResponse, unwrapEnvelope } from "./error";
import type { ApiSuccess } from "./types/pagination";
import type { BetterAuthSession } from "./types/auth";

/**
 * Server-side fetch for Server Components (ADR-010.2): Node-to-Node to
 * API_INTERNAL_URL (no proxy detour), forwarding the user's cookies.
 * Response caching is the caller's concern (`cache()` / `revalidate`).
 */

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

export interface ServerFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
}

async function forwardCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  // Fallback: read from headers
  const { headers } = await import("next/headers");
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie");
  if (allCookies.length === 0 && cookieHeader) {
    return cookieHeader;
  }
  return allCookies.map(({ name, value }) => `${name}=${value}`).join("; ");
}

export async function apiFetchServer<T>(
  path: string,
  { method = "GET", body, revalidate, tags }: ServerFetchOptions = {},
): Promise<ApiSuccess<T>> {
  const headers: Record<string, string> = { Cookie: await forwardCookieHeader() };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_INTERNAL_URL}/api/v1${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    next: { revalidate, tags },
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<T>(payload);
}

/**
 * Better Auth endpoints are served by the library before Nest's interceptor —
 * they are NOT enveloped (raw `{session, user}` or `null`).
 */
export async function apiRawServer<T>(path: string): Promise<T> {
  const response = await fetch(`${API_INTERNAL_URL}/api/v1${path}`, {
    headers: { Cookie: await forwardCookieHeader() },
    cache: "no-store",
  });
  const text = await response.text();
  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }
    throw parseErrorResponse(response.status, payload);
  }
  return (text ? JSON.parse(text) : null) as T;
}

/** Current session (null when signed out) — deduped per request via React cache(). */
export const getServerSession = cache(async (): Promise<BetterAuthSession | null> => {
  try {
    return await apiRawServer<BetterAuthSession | null>("/auth/get-session");
  } catch {
    return null;
  }
});

/** Guard helper for role-gated layouts (real check — proxy.ts is only a cheap gate). */
export async function requireServerRole(...roles: BetterAuthSession["user"]["role"][]) {
  const session = await getServerSession();
  if (!session || !roles.includes(session.user.role)) {
    return null;
  }
  return session;
}
