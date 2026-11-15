import { apiFetchServer } from "@/lib/api/server";
import type { MeAttemptItem, TestResultView } from "@/lib/api/types";
import type { MeResultItem } from "@/lib/api/types/attempts";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/**
 * Participant dashboard endpoints (session-authenticated, cookie-based).
 *
 * RSC only: the dashboard and the result page are server components, so there
 * is no browser half to keep here. A client island that needs these should get
 * its data as props from the page, not refetch it.
 */

export function fetchMeAttemptsServer(page = 1): Promise<ApiSuccess<MeAttemptItem[]>> {
  return apiFetchServer<MeAttemptItem[]>(`/me/attempts?page=${page}`);
}

export function fetchMeResultsServer(page = 1): Promise<ApiSuccess<MeResultItem[]>> {
  return apiFetchServer<MeResultItem[]>(`/me/results?page=${page}`);
}

/** Own released result web view — same shape as the feature 05 public result. */
export function fetchMeResultDetailServer(
  attemptId: string,
): Promise<ApiSuccess<TestResultView>> {
  return apiFetchServer<TestResultView>(`/me/results/${attemptId}`);
}
