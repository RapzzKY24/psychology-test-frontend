import { apiFetchServer, apiRawServer } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { PsychologistProfileResponse } from "@/lib/api/types";
import type { ReviewListItem } from "@/lib/api/types";
import type { ReviewStats } from "./types";

/** Server-only fetchers for the psychologist overview (RSC pages). */

export function fetchReviewQueueCount(): Promise<number> {
  return apiFetchServer<ReviewListItem[]>("/psychologist/reviews?status=PENDING_REVIEW&limit=1").then(
    (res: ApiSuccess<ReviewListItem[]>) => res.meta?.total ?? res.data.length,
  );
}

export function fetchReviewStatsServer(days: number): Promise<ApiSuccess<ReviewStats>> {
  return apiFetchServer<ReviewStats>(`/psychologist/stats/review?days=${days}`, {
    revalidate: 60,
  });
}

export function fetchMyProfile(): Promise<PsychologistProfileResponse> {
  // getProfile returns { data, complete } — not the standard envelope.
  return apiRawServer<PsychologistProfileResponse>("/psychologist/me/profile");
}
