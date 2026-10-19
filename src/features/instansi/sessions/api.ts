import { apiFetch } from "@/lib/api/client";
import type { SessionSummary } from "@/lib/api/types";
import type { InstansiInvoice, InstansiSessionDetail, ResetSeatResult } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

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

export function closeInstansiSession(id: string): Promise<ApiSuccess<SessionSummary>> {
  return apiFetch<SessionSummary>(`/instansi/sessions/${id}/close`, { method: "POST" });
}

/** `GET /instansi/sessions/:id` — detail (incl. invite `token` + batch invoice). */
export function fetchInstansiSessionDetail(id: string): Promise<ApiSuccess<InstansiSessionDetail>> {
  return apiFetch<InstansiSessionDetail>(`/instansi/sessions/${id}`);
}

/** Adds seats from the institution roster; returns the updated invoice amount. */
export function addInstansiParticipants(
  sessionId: string,
  employeeIds: string[],
): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetch<InstansiInvoice>(`/instansi/sessions/${sessionId}/participants`, {
    method: "POST",
    body: { employeeIds },
  });
}

/** Swaps a seat's linked employee (roster edits are free, anytime). */
export function swapInstansiParticipant(
  sessionId: string,
  participantId: string,
  employeeId: string,
): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetch<InstansiInvoice>(
    `/instansi/sessions/${sessionId}/participants/${participantId}`,
    { method: "PATCH", body: { employeeId } },
  );
}

export function removeInstansiParticipant(
  sessionId: string,
  participantId: string,
): Promise<ApiSuccess<InstansiInvoice>> {
  return apiFetch<InstansiInvoice>(
    `/instansi/sessions/${sessionId}/participants/${participantId}`,
    { method: "DELETE" },
  );
}

/** Unlocks a claimed seat so it can be re-claimed on another device. */
export function resetInstansiParticipant(
  sessionId: string,
  participantId: string,
): Promise<ApiSuccess<ResetSeatResult>> {
  return apiFetch<ResetSeatResult>(
    `/instansi/sessions/${sessionId}/participants/${participantId}/reset`,
    { method: "POST" },
  );
}
