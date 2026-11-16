import { apiFetch } from "@/lib/api/client";
import type { MeProfile, MeProfilePayload } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Browser-side half of the profile tab: PATCH, then the RSC tree refreshes. */
export function updateMeProfile(payload: MeProfilePayload): Promise<ApiSuccess<MeProfile>> {
  return apiFetch<MeProfile>("/me/profile", { method: "PATCH", body: payload });
}
