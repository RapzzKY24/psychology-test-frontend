/**
 * Mirrors docs/standards/api-contract.md §2 — the global response envelope.
 * Source of truth: src/common/interceptors/transform.interceptor.ts (BE).
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Single-resource success envelope: `{ data, message? }`. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/** List success envelope: `{ data: [...], meta }` — the list key is always `data`. */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** What apiFetch resolves to after unwrapping. */
export interface ApiSuccess<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

/** Standard list query params (api-contract §5): page default 1, limit default 10 max 100. */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
