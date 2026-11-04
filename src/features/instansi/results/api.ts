import { apiFetch } from "@/lib/api/client";
import { downloadFile } from "@/lib/download";
import type { InstansiResultItem } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

export interface InstansiResultFilters {
  page?: number;
  limit?: number;
}

function buildQuery(filters: InstansiResultFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** `GET /instansi/results` — approved results for the caller's institution. */
export function fetchInstansiResults(
  filters: InstansiResultFilters = {},
): Promise<ApiSuccess<InstansiResultItem[]>> {
  return apiFetch<InstansiResultItem[]>(`/instansi/results${buildQuery(filters)}`);
}

/** `GET /instansi/certificates/:id/pdf` — 404 if another institution owns it. */
export function downloadInstansiCertificatePdf(
  id: string,
  number: string | null,
): Promise<void> {
  const filename = number ? `sertifikat-${number.replace(/\//g, "-")}.pdf` : "sertifikat.pdf";
  return downloadFile(`/instansi/certificates/${encodeURIComponent(id)}/pdf`, filename);
}
