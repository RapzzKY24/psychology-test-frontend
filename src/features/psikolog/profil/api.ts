import { apiFetch } from "@/lib/api/client";
import { parseErrorResponse, unwrapEnvelope } from "@/lib/api/error";
import type { PsychologistProfile } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ProfileInput } from "./schemas";

export function updateMyProfile(input: ProfileInput) {
  return apiFetch<{ profile: PsychologistProfile; complete: boolean }>(
    "/psychologist/me/profile",
    { method: "PUT", body: input },
  );
}

/** Multipart signature upload (canvas PNG or file). */
export async function uploadMySignature(file: File): Promise<ApiSuccess<{ signatureImagePath: string }>> {
  const body = new FormData();
  body.append("file", file, file.name || "signature.png");
  const response = await fetch("/api/v1/psychologist/me/signature", {
    method: "POST",
    body,
    credentials: "include",
  });
  const text = await response.text();
  const payload: unknown = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw parseErrorResponse(response.status, payload);
  }
  return unwrapEnvelope<{ signatureImagePath: string }>(payload);
}
