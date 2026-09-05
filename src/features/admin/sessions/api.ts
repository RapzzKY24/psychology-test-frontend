import { apiFetch } from "@/lib/api/client";
import type { SessionSummary } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CreateSessionInput } from "./schemas";

export interface SessionFilters {
  page?: number;
  limit?: number;
}

function buildQuery(filters: SessionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchSessions(filters: SessionFilters = {}): Promise<ApiSuccess<SessionSummary[]>> {
  return apiFetch<SessionSummary[]>(`/admin/sessions${buildQuery(filters)}`);
}

export function createSession(
  input: CreateSessionInput,
): Promise<ApiSuccess<SessionSummary>> {
  return apiFetch<SessionSummary>("/admin/sessions", { method: "POST", body: input });
}

export function closeSession(id: string): Promise<ApiSuccess<SessionSummary>> {
  return apiFetch<SessionSummary>(`/admin/sessions/${id}/close`, { method: "POST" });
}
