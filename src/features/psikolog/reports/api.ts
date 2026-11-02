import { apiFetch } from "@/lib/api/client";
import { downloadFile } from "@/lib/download";
import type {
  IssuedReport,
  ReportCandidate,
  ReportDraftPayload,
  ReportFormData,
  ReportListItem,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface ReportFilters {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "ACTIVE" | "SUPERSEDED" | "REVOKED";
  sessionId?: string;
}

function buildQuery(filters: ReportFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.sessionId) params.set("sessionId", filters.sessionId);
  return params.toString();
}

/** `GET /psychologist/reports` — reports that already have a row. */
export function fetchReports(filters: ReportFilters = {}): Promise<ApiSuccess<ReportListItem[]>> {
  return apiFetch<ReportListItem[]>(`/psychologist/reports?${buildQuery(filters)}`);
}

/** `GET /psychologist/reports/pending` — participants waiting for a report. */
export function fetchPendingReports(
  filters: ReportFilters = {},
): Promise<ApiSuccess<ReportCandidate[]>> {
  return apiFetch<ReportCandidate[]>(`/psychologist/reports/pending?${buildQuery(filters)}`);
}

/** `GET /psychologist/reports/:participantId` — also creates the draft on first open. */
export function fetchReportForm(participantId: string): Promise<ApiSuccess<ReportFormData>> {
  return apiFetch<ReportFormData>(`/psychologist/reports/${encodeURIComponent(participantId)}`);
}

export function saveReportDraft(
  participantId: string,
  payload: ReportDraftPayload,
): Promise<ApiSuccess<ReportFormData>> {
  return apiFetch<ReportFormData>(`/psychologist/reports/${encodeURIComponent(participantId)}`, {
    method: "PUT",
    body: payload,
  });
}

/** Assigns the number and freezes the document. Irreversible — admin revises later. */
export function issueReport(participantId: string): Promise<ApiSuccess<IssuedReport>> {
  return apiFetch<IssuedReport>(
    `/psychologist/reports/${encodeURIComponent(participantId)}/issue`,
    { method: "POST" },
  );
}

/** `GET /psychologist/reports/:id/pdf` — ACTIVE reports only. */
export function downloadReportPdf(id: string, number: string | null): Promise<void> {
  const filename = number ? `laporan-${number.replace(/\//g, "-")}.pdf` : "laporan.pdf";
  return downloadFile(`/psychologist/reports/${encodeURIComponent(id)}/pdf`, filename);
}
