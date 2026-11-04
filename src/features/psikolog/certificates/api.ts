import { apiFetch, apiFetchRaw } from "@/lib/api/client";
import { parseErrorResponse, unwrapEnvelope } from "@/lib/api/error";
import { downloadFile } from "@/lib/download";
import type {
  CertificateFormData,
  CertificateListItem,
  CertificatePayload,
  CertificateRecord,
  CertificateStatus,
  IssuedCertificate,
  PendingCertificateResult,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

function pendingQuery(filters: { page?: number; limit?: number }): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return params.toString();
}

export interface CertificateFilters {
  page?: number;
  limit?: number;
  status?: CertificateStatus;
}

/** `GET /certificates` — the psychologist's own drafts and issued rows. */
export function fetchCertificates(
  filters: CertificateFilters = {},
): Promise<ApiSuccess<CertificateListItem[]>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.status) params.set("status", filters.status);
  return apiFetch<CertificateListItem[]>(`/certificates?${params.toString()}`);
}

/** `GET /certificates/pending` — approved, non-WPT results without a certificate. */
export function fetchPendingCertificates(
  filters: { page?: number; limit?: number } = {},
): Promise<ApiSuccess<PendingCertificateResult[]>> {
  return apiFetch<PendingCertificateResult[]>(`/certificates/pending?${pendingQuery(filters)}`);
}

/** `GET /certificates/:id` — the row, its result and how far it is from printable. */
export function fetchCertificate(id: string): Promise<ApiSuccess<CertificateFormData>> {
  return apiFetch<CertificateFormData>(`/certificates/${encodeURIComponent(id)}`);
}

/**
 * `POST /certificates` — opens (or reopens) the draft for a result. Idempotent:
 * a second click returns the row that already exists.
 */
export function createCertificateDraft(resultId: string): Promise<ApiSuccess<CertificateRecord>> {
  return apiFetch<CertificateRecord>("/certificates", {
    method: "POST",
    body: { resultId },
  });
}

export function saveCertificateDraft(
  id: string,
  payload: CertificatePayload,
): Promise<ApiSuccess<CertificateRecord>> {
  return apiFetch<CertificateRecord>(`/certificates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

/** Multipart — the API client only speaks JSON, so this one goes out by hand. */
export async function uploadCertificatePhoto(
  id: string,
  file: File,
): Promise<ApiSuccess<CertificateRecord>> {
  const body = new FormData();
  body.append("file", file, file.name || "foto.jpg");
  const response = await fetch(`/api/v1/certificates/${encodeURIComponent(id)}/photo`, {
    method: "POST",
    body,
    credentials: "include",
  });
  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<CertificateRecord>(payload);
}

/** Assigns the number and freezes the document. Irreversible. */
export function issueCertificate(id: string): Promise<ApiSuccess<IssuedCertificate>> {
  return apiFetch<IssuedCertificate>(`/certificates/${encodeURIComponent(id)}/issue`, {
    method: "POST",
  });
}

/** Opens a correction draft. The issued certificate keeps its number and stays live. */
export function createCertificateRevision(id: string): Promise<ApiSuccess<CertificateRecord>> {
  return apiFetch<CertificateRecord>(`/certificates/${encodeURIComponent(id)}/revision`, {
    method: "POST",
  });
}

export function revokeCertificate(
  id: string,
  reason: string,
): Promise<ApiSuccess<CertificateRecord>> {
  return apiFetch<CertificateRecord>(`/certificates/${encodeURIComponent(id)}/revoke`, {
    method: "POST",
    body: { reason },
  });
}

/** `GET /certificates/:id/pdf` — ACTIVE only; the server names the file. */
export function downloadCertificatePdf(id: string, number: string | null): Promise<void> {
  const fallback = number ? `sertifikat-${number.replace(/\//g, "-")}.pdf` : "sertifikat.pdf";
  return downloadFile(`/certificates/${encodeURIComponent(id)}/pdf`, fallback);
}

/**
 * The draft as it will look once signed. Rendered server-side from the stored
 * rows, not from this form, so what the psychologist approves is what prints.
 */
export async function openCertificatePreview(id: string): Promise<void> {
  const response = await apiFetchRaw(`/certificates/${encodeURIComponent(id)}/preview`);
  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }
    throw parseErrorResponse(response.status, payload);
  }

  const url = URL.createObjectURL(await response.blob());
  window.open(url, "_blank", "noopener,noreferrer");
  // Revoked on navigation in practice; the timeout keeps Safari from blanking
  // the tab it was just handed.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
