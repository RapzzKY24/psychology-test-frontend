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
  /** Skip envelope unwrap + error parsing (binary endpoints: PDF, QRIS image). */
  raw?: boolean;
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

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, participantToken, signal, raw = false }: ApiFetchOptions = {},
): Promise<ApiSuccess<T> | Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (participantToken) headers["x-participant-token"] = participantToken;

  const response = await fetch(`${BASE_PATH}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (raw) return response;

  const payload = await parseBody(response);
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<T>(payload);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && error.name === "ApiError";
}
