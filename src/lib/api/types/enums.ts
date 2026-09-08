/**
 * Mirrors prisma/schema.prisma enums (verified 2026-09-05).
 * Keep in sync with the schema — a mismatch here is a contract bug.
 */

export const USER_ROLES = ["ADMIN", "PSYCHOLOGIST", "PARTICIPANT", "INSTANSI"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TEST_CATEGORIES = [
  "PERSONALITY",
  "COGNITIVE",
  "WORK_STYLE",
  "INTEREST",
  "PROJECTIVE",
] as const;
export type TestCategory = (typeof TEST_CATEGORIES)[number];

export const TEST_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type TestStatus = (typeof TEST_STATUSES)[number];

export const SCORER_TYPES = ["FORCED_CHOICE_DISC"] as const;
export type ScorerType = (typeof SCORER_TYPES)[number];

export const SESSION_KINDS = ["INDIVIDUAL", "GROUP"] as const;
export type SessionKind = (typeof SESSION_KINDS)[number];

export const SESSION_STATUSES = ["ACTIVE", "CLOSED"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const ATTEMPT_STATUSES = ["IN_PROGRESS", "COMPLETED", "ABANDONED"] as const;
export type AttemptStatus = (typeof ATTEMPT_STATUSES)[number];

export const RESULT_STATUSES = ["PENDING_REVIEW", "APPROVED", "RETURNED"] as const;
export type ResultStatus = (typeof RESULT_STATUSES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "EXPIRED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const INVOICE_STATUSES = ["UNPAID", "PAID", "CANCELLED"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

/** Indonesian labels for UI copy (docs/features/README.md: UI copy Bahasa Indonesia). */
export const TEST_CATEGORY_LABELS: Record<TestCategory, string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Dibayar",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

export const RESULT_STATUS_LABELS: Record<ResultStatus, string> = {
  PENDING_REVIEW: "Menunggu Review",
  APPROVED: "Disetujui",
  RETURNED: "Dikembalikan",
};

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  IN_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  ABANDONED: "Ditinggalkan",
};
