import { apiFetch } from "@/lib/api/client";
import { parseErrorResponse, unwrapEnvelope } from "@/lib/api/error";
import type { AttemptRead, AttemptComplete, Education, Gender } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Attempt endpoints — public routes guarded by cookie (participant) OR
 * `x-participant-token` (guest). The api client attaches the guest token.
 */

export function fetchAttempt(
  attemptId: string,
  participantToken?: string | undefined,
  birthDate?: string | null,
  gender?: Gender | null,
  education?: Education | null,
): Promise<ApiSuccess<AttemptRead>> {
  // Only needed the first time a banded, gendered or education-banded test is
  // opened; the API stores all three and later calls ignore the parameters.
  const params = new URLSearchParams();
  if (birthDate) params.set("birthDate", birthDate);
  if (gender) params.set("gender", gender);
  if (education) params.set("education", education);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiFetch<AttemptRead>(`/public/attempts/${attemptId}${query}`, { participantToken });
}

export function putResponse(
  attemptId: string,
  itemId: string,
  value: unknown,
  participantToken?: string | undefined,
): Promise<ApiSuccess<unknown>> {
  return apiFetch<unknown>(`/public/attempts/${attemptId}/responses`, {
    method: "PUT",
    body: { itemId, value },
    participantToken: participantToken ?? undefined,
  });
}

export function completeAttempt(
  attemptId: string,
  participantToken?: string | undefined,
): Promise<ApiSuccess<AttemptComplete>> {
  return apiFetch<AttemptComplete>(`/public/attempts/${attemptId}/complete`, {
    method: "POST",
    participantToken: participantToken ?? undefined,
  });
}

/**
 * Multipart drawing upload. `apiFetch` serialises the body as JSON and sets
 * that header, which would break a `FormData` upload, so this call goes out
 * through plain `fetch` — same cookie + guest-token rules as the other
 * attempt routes.
 */
export async function uploadItemImage(
  attemptId: string,
  itemId: string,
  file: File,
  participantToken?: string | undefined,
): Promise<ApiSuccess<{ imageUrl: string }>> {
  const body = new FormData();
  body.append("file", file, file.name || "drawing.png");
  const headers: Record<string, string> = {};
  if (participantToken) headers["x-participant-token"] = participantToken;

  const response = await fetch(`/api/v1/public/attempts/${attemptId}/items/${itemId}/image`, {
    method: "POST",
    headers,
    credentials: "include",
    body,
  });
  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<{ imageUrl: string }>(payload);
}
