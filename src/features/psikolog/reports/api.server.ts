import { apiFetchServer } from "@/lib/api/server";
import type { ReportCandidate, ReportFormData, ReportListItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Server-only fetchers for the psychologist report pages (RSC). */

export function fetchReportsServer(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<ReportListItem[]>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetchServer<ReportListItem[]>(`/psychologist/reports?${params.toString()}`);
}

export function fetchPendingReportsServer(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<ReportCandidate[]>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetchServer<ReportCandidate[]>(`/psychologist/reports/pending?${params.toString()}`);
}

export function fetchReportFormServer(participantId: string): Promise<ApiSuccess<ReportFormData>> {
  return apiFetchServer<ReportFormData>(
    `/psychologist/reports/${encodeURIComponent(participantId)}`,
  );
}
