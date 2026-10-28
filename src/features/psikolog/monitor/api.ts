import { apiFetchServer, apiRawServer } from "@/lib/api/server";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { PsychologistProfileResponse } from "@/lib/api/types";
import type { ReviewListItem } from "@/lib/api/types";

/** Server-only fetchers for the psychologist overview (RSC pages). */

export interface ReviewStatsPoint {
  /** `YYYY-MM-DD` in Asia/Jakarta. */
  date: string;
  count: number;
}

export interface ReviewStats {
  incoming: ReviewStatsPoint[];
  mine: { approved7d: number; returned7d: number };
  queueNow: number;
}

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
