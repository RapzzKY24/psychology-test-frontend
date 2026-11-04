import { apiFetchServer } from "@/lib/api/server";
import type {
  CertificateFormData,
  CertificateListItem,
  PendingCertificateResult,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Server-only fetchers for the psychologist certificate pages (RSC). */

export function fetchCertificatesServer(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<CertificateListItem[]>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetchServer<CertificateListItem[]>(`/certificates?${params.toString()}`);
}

export function fetchPendingCertificatesServer(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<PendingCertificateResult[]>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return apiFetchServer<PendingCertificateResult[]>(`/certificates/pending?${params.toString()}`);
}

export function fetchCertificateServer(id: string): Promise<ApiSuccess<CertificateFormData>> {
  return apiFetchServer<CertificateFormData>(`/certificates/${encodeURIComponent(id)}`);
}
