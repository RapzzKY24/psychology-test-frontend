import { cache } from "react";
import { apiFetchServer } from "@/lib/api/server";
import { isApiError } from "@/lib/api/client";
import type {
  PublicTest,
  PublicArticleListItem,
  PublicArticle,
  PublicPsychologist,
  PublicStats,
  InvoiceVerification,
  ReportVerification,
  CertificateVerification,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Public read fetchers (catalog tests + published articles). RSC-only — the
 * browser talks to these through the same-origin `/api/v1` proxy elsewhere.
 * `cache()` dedupes per-request; `revalidate` gives light ISR for public pages.
 */

const PUBLIC_REVALIDATE = 300;

export const fetchPublicTestsServer = cache(
  (
    filters: { limit?: number; page?: number; category?: string } = {},
  ): Promise<ApiSuccess<PublicTest[]>> => {
    const params = new URLSearchParams();
    params.set("limit", String(filters.limit ?? 12));
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.category) params.set("category", filters.category);
    return apiFetchServer<PublicTest[]>(`/tests?${params.toString()}`, {
      revalidate: PUBLIC_REVALIDATE,
    });
  },
);

export const fetchPublicTestServer = cache((slug: string): Promise<ApiSuccess<PublicTest>> =>
  apiFetchServer<PublicTest>(`/tests/${slug}`, { revalidate: PUBLIC_REVALIDATE }),
);

/**
 * The psychologists who sign reports. Site-level, not per test: the catalog has
 * no author field, so this is the same list on every detail page.
 */
export const fetchPublicPsychologistsServer = cache(
  (): Promise<ApiSuccess<PublicPsychologist[]>> =>
    apiFetchServer<PublicPsychologist[]>("/psychologists", {
      revalidate: PUBLIC_REVALIDATE,
    }),
);

/** Counts for the landing page's proof band — always derived, never typed in. */
export const fetchPublicStatsServer = cache((): Promise<ApiSuccess<PublicStats>> =>
  apiFetchServer<PublicStats>("/public/stats", { revalidate: PUBLIC_REVALIDATE }),
);

export const fetchPublicArticlesServer = cache(
  (
    filters: { limit?: number; page?: number; category?: string; search?: string } = {},
  ): Promise<ApiSuccess<PublicArticleListItem[]>> => {
    const params = new URLSearchParams();
    params.set("limit", String(filters.limit ?? 12));
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    return apiFetchServer<PublicArticleListItem[]>(`/articles?${params.toString()}`, {
      revalidate: PUBLIC_REVALIDATE,
    });
  },
);

/** Distinct published categories present in the public catalog (derived, not hardcoded). */
export const fetchPublicArticleCategories = cache(async (): Promise<string[]> => {
  const res = await fetchPublicArticlesServer({ limit: 100 });
  const cats = new Set(
    res.data
      .map((a) => a.category)
      .filter((c): c is string => typeof c === "string" && c.length > 0),
  );
  return Array.from(cats).sort();
});

export const fetchPublicArticleServer = cache((slug: string) =>
  apiFetchServer<PublicArticle>(`/articles/${slug}`, { revalidate: PUBLIC_REVALIDATE }),
);

/**
 * Verifikasi invoice lewat token QR. Tidak boleh di-cache: status pembayaran
 * bisa berubah kapan saja dan halaman ini dipakai untuk membuktikan keadaan
 * saat ini.
 */
const fetchInvoiceVerificationServer = cache(
  (token: string): Promise<ApiSuccess<InvoiceVerification>> =>
    apiFetchServer<InvoiceVerification>(`/invoices/verify/${encodeURIComponent(token)}`, {
      revalidate: false,
    }),
);

/**
 * Versi yang dipakai halaman: token tidak dikenal (404) dan token yang
 * bentuknya bukan UUID (422) sama-sama berarti "tidak ada dokumen", bukan
 * kegagalan server.
 */
export async function findInvoiceVerificationServer(
  token: string,
): Promise<InvoiceVerification | null> {
  try {
    return (await fetchInvoiceVerificationServer(token)).data;
  } catch (error) {
    if (isApiError(error) && (error.isNotFound || error.statusCode === 422)) {
      return null;
    }
    throw error;
  }
}

/**
 * Verifikasi laporan lewat kode QR. Sama seperti invoice: jangan di-cache,
 * karena status laporan bisa berubah (revisi/revoke).
 */
const fetchReportVerificationServer = cache(
  (code: string): Promise<ApiSuccess<ReportVerification>> =>
    apiFetchServer<ReportVerification>(`/public/reports/verify/${encodeURIComponent(code)}`, {
      revalidate: false,
    }),
);

/**
 * Kode yang tidak terdaftar tetap dijawab 200 `{ valid: false }` oleh backend,
 * jadi null hanya berarti "tidak ada dokumen" untuk kode kosong/rusak.
 */
export async function findReportVerificationServer(
  code: string,
): Promise<ReportVerification | null> {
  try {
    return (await fetchReportVerificationServer(code)).data;
  } catch (error) {
    if (isApiError(error) && (error.isNotFound || error.statusCode === 422)) {
      return null;
    }
    throw error;
  }
}

/** Verifikasi sertifikat lewat kode QR. Tidak di-cache: revisi dan pembatalan mengubah jawabannya. */
const fetchCertificateVerificationServer = cache(
  (code: string): Promise<ApiSuccess<CertificateVerification>> =>
    apiFetchServer<CertificateVerification>(
      `/public/certificates/verify/${encodeURIComponent(code)}`,
      { revalidate: false },
    ),
);

export async function findCertificateVerificationServer(
  code: string,
): Promise<CertificateVerification | null> {
  try {
    return (await fetchCertificateVerificationServer(code)).data;
  } catch (error) {
    if (isApiError(error) && (error.isNotFound || error.statusCode === 422)) {
      return null;
    }
    throw error;
  }
}
