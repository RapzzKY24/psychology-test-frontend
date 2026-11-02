import { apiFetch } from "@/lib/api/client";
import { downloadFile } from "@/lib/download";
import type { InstansiReportItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface InstansiReportFilters {
  page?: number;
  limit?: number;
  sessionId?: string;
}

function buildQuery(filters: InstansiReportFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.sessionId) params.set("sessionId", filters.sessionId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** `GET /instansi/reports` — scope comes from the session cookie, never a param. */
export function fetchInstansiReports(
  filters: InstansiReportFilters = {},
): Promise<ApiSuccess<InstansiReportItem[]>> {
  return apiFetch<InstansiReportItem[]>(`/instansi/reports${buildQuery(filters)}`);
}

/** `GET /instansi/reports/:id/pdf` — 403 if the report belongs to another institution. */
export function downloadInstansiReportPdf(id: string, number: string | null): Promise<void> {
  const filename = number ? `laporan-${number.replace(/\//g, "-")}.pdf` : "laporan.pdf";
  return downloadFile(`/instansi/reports/${encodeURIComponent(id)}/pdf`, filename);
}
