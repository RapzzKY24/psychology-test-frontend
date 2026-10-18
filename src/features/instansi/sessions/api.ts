import { apiFetch } from "@/lib/api/client";
import type { SessionDetail, SessionSummary } from "@/lib/api/types";
import type { InstansiBatchCreateResult } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CreateInstansiSessionInput } from "./schemas";

export interface InstansiSessionFilters {
  page?: number;
  limit?: number;
}

export interface PublishedTestOption {
  id: string;
  name: string;
}

function buildQuery(filters: InstansiSessionFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchInstansiSessions(
  filters: InstansiSessionFilters = {},
): Promise<ApiSuccess<SessionSummary[]>> {
  return apiFetch<SessionSummary[]>(`/instansi/sessions${buildQuery(filters)}`);
}

export function createInstansiSession(
  input: CreateInstansiSessionInput,
): Promise<ApiSuccess<InstansiBatchCreateResult>> {
  return apiFetch<InstansiBatchCreateResult>("/instansi/sessions", {
    method: "POST",
    body: {
      ...input,
      pin: input.pin || undefined,
      expiresAt: new Date(input.expiresAt).toISOString(),
    },
  });
}

export function closeInstansiSession(id: string): Promise<ApiSuccess<SessionSummary>> {
  return apiFetch<SessionSummary>(`/instansi/sessions/${id}/close`, { method: "POST" });
}

/** `GET /instansi/sessions/:id` — detail (incl. invite `token`). */
export function fetchInstansiSessionDetail(id: string): Promise<ApiSuccess<SessionDetail>> {
  return apiFetch<SessionDetail>(`/instansi/sessions/${id}`);
}
