import { apiFetch } from "@/lib/api/client";
import type { JoinSessionResult } from "@/lib/api/types/sessions";
import type { PublicSessionPreviewDto } from "@/features/guest/schemas";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { JoinSessionInput } from "./schemas";

/** Public endpoints — anonymous, through the same-origin proxy. */

export function fetchSessionPreview(
  token: string,
): Promise<ApiSuccess<PublicSessionPreviewDto>> {
  return apiFetch<PublicSessionPreviewDto>(`/public/sessions/${token}`);
}

export function joinSession(
  token: string,
  input: JoinSessionInput,
): Promise<ApiSuccess<JoinSessionResult>> {
  return apiFetch<JoinSessionResult>(`/public/sessions/${token}/join`, {
    method: "POST",
    body: input,
  });
}

/** Roster claim: pick a pre-created seat, get a working token. */
export function claimSeat(
  token: string,
  participantId: string,
): Promise<ApiSuccess<JoinSessionResult>> {
  return apiFetch<JoinSessionResult>(`/public/sessions/${token}/claim`, {
    method: "POST",
    body: { participantId },
  });
}
