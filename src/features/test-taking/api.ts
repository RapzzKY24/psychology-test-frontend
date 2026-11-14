import { apiFetch } from "@/lib/api/client";
import type { AttemptRead, AttemptComplete } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Attempt endpoints — public routes guarded by cookie (participant) OR
 * `x-participant-token` (guest). The api client attaches the guest token.
 */

export function fetchAttempt(
  attemptId: string,
  participantToken?: string | undefined,
  birthDate?: string | null,
): Promise<ApiSuccess<AttemptRead>> {
  // Only needed the first time a banded test is opened; the API stores it and
  // later calls ignore the parameter.
  const query = birthDate ? `?birthDate=${encodeURIComponent(birthDate)}` : "";
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
