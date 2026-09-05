import { parseErrorResponse, unwrapEnvelope, type ApiError } from "./error";
import type { ApiSuccess } from "./types/pagination";

/**
 * Browser-side fetch (ADR-010): same-origin `/api/v1` — Next.js rewrites proxy
 * it to the NestJS backend. Cookies ride along first-party; guest calls attach
 * `x-participant-token` (ADR-005).
 */

const BASE_PATH = "/api/v1";

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Guest session token (ADR-005) — sent as `x-participant-token`. */
  participantToken?: string;
  signal?: AbortSignal;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function doFetch(path: string, opts: ApiFetchOptions): Promise<Response> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.participantToken) headers["x-participant-token"] = opts.participantToken;

  return fetch(`${BASE_PATH}${path}`, {
    method: opts.method ?? "GET",
    headers,
    credentials: "include",
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });
}

/** JSON endpoint → unwraps the envelope; non-2xx throws ApiError. */
export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {},
): Promise<ApiSuccess<T>> {
  const response = await doFetch(path, opts);
  const payload = await parseBody(response);
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<T>(payload);
}

/**
 * Binary / non-enveloped endpoints (PDF streams, QRIS image, Better Auth
 * routes) — returns the raw Response for the caller to handle.
 */
export async function apiFetchRaw(path: string, opts: ApiFetchOptions = {}): Promise<Response> {
  return doFetch(path, opts);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && error.name === "ApiError";
}
