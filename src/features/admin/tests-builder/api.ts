import { apiFetch } from "@/lib/api/client";
import type {
  AdminTest,
  AdminTestDetail,
  TestCategory,
  TestStatus,
} from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { CreateTestInput } from "./schemas";

/**
 * Admin tests endpoints (features/admin/tests-builder) — browser-safe.
 * Server variants live in api.server.ts (they need next/headers).
 * All role-gated ADMIN by the backend; errors arrive as ApiError with catalog codes.
 */

export type TestStatusFilter = TestStatus | undefined;

export interface AdminTestFilters {
  page?: number;
  limit?: number;
  status?: TestStatusFilter;
  category?: TestCategory | undefined;
}

function buildQuery(filters: AdminTestFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchAdminTests(filters: AdminTestFilters = {}): Promise<ApiSuccess<AdminTest[]>> {
  return apiFetch<AdminTest[]>(`/admin/tests${buildQuery(filters)}`);
}

export function fetchAdminTestDetail(id: string): Promise<ApiSuccess<AdminTestDetail>> {
  return apiFetch<AdminTestDetail>(`/admin/tests/${id}`);
}

export function createTest(input: CreateTestInput): Promise<ApiSuccess<AdminTest>> {
  return apiFetch<AdminTest>("/admin/tests", { method: "POST", body: input });
}

export type UpdateTestInput = Partial<Omit<CreateTestInput, "scorerType">>;

export function updateTest(id: string, input: UpdateTestInput): Promise<ApiSuccess<AdminTest>> {
  return apiFetch<AdminTest>(`/admin/tests/${id}`, { method: "PATCH", body: input });
}

export function putTestItems(
  id: string,
  items: Array<{ content: unknown }>,
): Promise<ApiSuccess<{ count: number }>> {
  return apiFetch<{ count: number }>(`/admin/tests/${id}/items`, {
    method: "PUT",
    body: { items },
  });
}

export function putInterpretations(
  id: string,
  interpretations: Array<{ patternCode: string; title: string; body: string }>,
): Promise<ApiSuccess<{ count: number }>> {
  return apiFetch<{ count: number }>(`/admin/tests/${id}/interpretations`, {
    method: "PUT",
    body: { interpretations },
  });
}

export function publishTest(id: string): Promise<ApiSuccess<AdminTest>> {
  return apiFetch<AdminTest>(`/admin/tests/${id}/publish`, { method: "POST" });
}

export function archiveTest(id: string): Promise<ApiSuccess<AdminTest>> {
  return apiFetch<AdminTest>(`/admin/tests/${id}/archive`, { method: "POST" });
}

export async function uploadItemImage(
  testId: string,
  file: File,
): Promise<ApiSuccess<{ imageUrl: string }>> {
  const form = new FormData();
  form.append("file", file, file.name || "image.png");
  const response = await fetch(`/api/v1/admin/tests/${testId}/items/image`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const { parseErrorResponse } = await import("@/lib/api/error");
    throw parseErrorResponse(response.status, payload);
  }
  const { unwrapEnvelope } = await import("@/lib/api/error");
  return unwrapEnvelope<{ imageUrl: string }>(payload);
}
