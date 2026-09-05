import { apiFetch } from "@/lib/api/client";
import { apiFetchServer } from "@/lib/api/server";
import type { MeAttemptItem, TestResultView } from "@/lib/api/types";
import type { MeResultItem } from "@/lib/api/types/attempts";
import type { ApiSuccess } from "@/lib/api/types/pagination";

/** Participant dashboard endpoints (session-authenticated, cookie-based). */

export function fetchMeAttempts(page = 1): Promise<ApiSuccess<MeAttemptItem[]>> {
  return apiFetch<MeAttemptItem[]>(`/me/attempts?page=${page}`);
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchMeAttemptsServer(page = 1): Promise<ApiSuccess<MeAttemptItem[]>> {
  return apiFetchServer<MeAttemptItem[]>(`/me/attempts?page=${page}`);
}

export function fetchMeResults(page = 1): Promise<ApiSuccess<MeResultItem[]>> {
  return apiFetch<MeResultItem[]>(`/me/results?page=${page}`);
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchMeResultsServer(page = 1): Promise<ApiSuccess<MeResultItem[]>> {
  return apiFetchServer<MeResultItem[]>(`/me/results?page=${page}`);
}

/** Own released result web view — same shape as the feature 05 public result. */
export function fetchMeResultDetail(attemptId: string): Promise<ApiSuccess<TestResultView>> {
  return apiFetch<TestResultView>(`/me/results/${attemptId}`);
}

/** RSC variant — Node-to-Node with cookie forwarding. */
export function fetchMeResultDetailServer(
  attemptId: string,
): Promise<ApiSuccess<TestResultView>> {
  return apiFetchServer<TestResultView>(`/me/results/${attemptId}`);
}
