/**
 * Error handling per docs/standards/api-contract.md §3 + §7.
 * The backend error envelope is `{ statusCode, message, error, details? }` where
 * `message` is a fixed snake_case catalog code. The FE maps codes to Indonesian
 * copy — raw messages are never shown when a known code exists.
 */

import type { ApiSuccess, PaginationMeta } from "./types/pagination";

/** Shared fallback copy — reuse instead of re-typing it per feature. */
export const GENERIC_ERROR_MESSAGE = "Terjadi kesalahan — coba lagi.";

/** Known catalog codes (api-contract §7 + verified backend usages). */
export const KNOWN_ERROR_CODES = [
  // Auth
  "unauthorized",
  "forbidden",
  "too_many_requests",
  // Tests
  "validation_failed",
  "edit_locked",
  // Sessions
  "invalid_pin",
  "session_full",
  "session_expired",
  "session_closed",
  "test_archived",
  // Attempts / Results
  "result_not_released",
  "result_not_approved",
  "result_already_approved",
  "result_returned",
  // Payments
  "already_verified",
  "order_cancelled",
  "order_not_paid",
  "qris_not_configured",
  "file_too_large",
  "unsupported_media_type",
  // Psychologist
  "profile_incomplete",
  "not_returned",
  // Admin
  "cannot_change_own_role",
  // Instansi
  "duplicate_email",
  // Misc
  "invalid_query",
  "email_failed",
] as const;

export type ErrorCode = (typeof KNOWN_ERROR_CODES)[number];

/** Indonesian UI copy per catalog code (docs rule: UI copy Bahasa Indonesia). */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  unauthorized: "Sesi berakhir — silakan masuk kembali.",
  forbidden: "Anda tidak memiliki akses ke halaman ini.",
  too_many_requests: "Terlalu banyak percobaan. Coba lagi sebentar lagi.",
  validation_failed: "Data yang dikirim tidak valid.",
  edit_locked: "Data sedang dikunci karena ada peserta yang masih mengerjakan tes.",
  invalid_pin: "PIN salah.",
  session_full: "Kuota sesi sudah penuh.",
  session_expired: "Sesi sudah kedaluwarsa.",
  session_closed: "Sesi sudah ditutup.",
  test_archived: "Tes ini sudah diarsipkan.",
  result_not_released: "Hasil belum dirilis — menunggu review psikolog.",
  result_not_approved: "Hasil belum disetujui psikolog.",
  result_already_approved: "Hasil sudah disetujui sebelumnya.",
  result_returned: "Hasil sedang dalam status dikembalikan.",
  already_verified: "Pembayaran ini sudah diverifikasi sebelumnya.",
  order_cancelled: "Pesanan sudah dibatalkan.",
  order_not_paid: "Pembayaran belum terkonfirmasi.",
  qris_not_configured: "QRIS belum dikonfigurasi — hubungi admin.",
  file_too_large: "Ukuran file terlalu besar.",
  unsupported_media_type: "Format file tidak didukung.",
  profile_incomplete: "Lengkapi profil dan tanda tangan terlebih dahulu.",
  not_returned: "Hasil tidak dalam status dikembalikan.",
  cannot_change_own_role: "Anda tidak bisa mengubah role akun sendiri.",
  duplicate_email: "Email sudah terdaftar — silakan masuk.",
  invalid_query: "Parameter query tidak valid.",
  email_failed: "Gagal mengirim email — coba lagi nanti.",
};

/** Fallback copy by status when the code is unknown (404s use human messages). */
const STATUS_FALLBACK: Record<number, string> = {
  400: "Permintaan tidak valid.",
  401: "Sesi berakhir — silakan masuk kembali.",
  403: "Anda tidak memiliki akses ke halaman ini.",
  404: "Data tidak ditemukan.",
  409: "Konflik dengan data yang sudah ada.",
  410: "Sesi sudah berakhir atau ditutup.",
  413: "Ukuran file terlalu besar.",
  415: "Format file tidak didukung.",
  422: "Data yang dikirim tidak valid.",
  429: "Terlalu banyak percobaan. Coba lagi sebentar lagi.",
  502: "Layanan sedang bermasalah — coba lagi nanti.",
};

/** Backend error envelope (api-contract §3). */
export interface ErrorEnvelope {
  statusCode: number;
  message: string;
  error?: string;
  details?: string[];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Maps an error body into the best Indonesian copy (catalog → status → raw). */
export function errorMessageFor(code: string, statusCode: number): string {
  if ((KNOWN_ERROR_CODES as readonly string[]).includes(code)) {
    return ERROR_MESSAGES[code as ErrorCode];
  }
  return STATUS_FALLBACK[statusCode] ?? GENERIC_ERROR_MESSAGE;
}

export class ApiError extends Error {
  readonly statusCode: number;
  /** The raw backend `message` (catalog code when known). */
  readonly code: string;
  readonly details?: string[];

  constructor(statusCode: number, code: string, details?: string[]) {
    super(errorMessageFor(code, statusCode));
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isValidation(): boolean {
    return this.code === "validation_failed";
  }

  /** The pre-approval 403 is an expected state for participants, not a crash. */
  get isResultNotReleased(): boolean {
    return this.code === "result_not_released";
  }
}

/** Parses any error body into an ApiError (safe on non-JSON/network failures). */
export function parseErrorResponse(status: number, body: unknown): ApiError {
  if (isRecord(body) && typeof body.message === "string") {
    const details =
      Array.isArray(body.details) && body.details.every((d) => typeof d === "string")
        ? (body.details as string[])
        : undefined;
    return new ApiError(status, body.message, details);
  }
  return new ApiError(status, "unknown_error");
}

/** Success envelope shape guard (api-contract §2). Reuses the shared contract type. */
export function unwrapEnvelope<T>(body: unknown): ApiSuccess<T> {
  if (isRecord(body) && "data" in body) {
    const meta =
      isRecord(body.meta) &&
      typeof body.meta.page === "number" &&
      typeof body.meta.limit === "number" &&
      typeof body.meta.total === "number" &&
      typeof body.meta.totalPages === "number"
        ? (body.meta as unknown as PaginationMeta)
        : undefined;
    return {
      data: body.data as T,
      meta,
      message: typeof body.message === "string" ? body.message : undefined,
    };
  }
  // Defensive: a 2xx response that bypassed the TransformInterceptor.
  return { data: body as T };
}
