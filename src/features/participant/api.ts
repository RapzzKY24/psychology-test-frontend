import { apiFetchServer } from "@/lib/api/server";
import type { MeAttemptItem, MeCertificateItem, MeProfile, TestResultView } from "@/lib/api/types";
import type { MeResultItem } from "@/lib/api/types/attempts";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import type { ParticipantStage } from "@/features/participant/stages";

/**
 * Participant dashboard endpoints (session-authenticated, cookie-based).
 *
 * RSC only: the dashboard and the result page are server components, so there
 * is no browser half to keep here. A client island that needs these should get
 * its data as props from the page, not refetch it.
 */

export function fetchMeAttemptsServer(
  params: { page?: number; stage?: ParticipantStage } = {},
): Promise<ApiSuccess<MeAttemptItem[]>> {
  const query = new URLSearchParams({ page: String(params.page ?? 1) });
  if (params.stage) query.set("stage", params.stage);
  return apiFetchServer<MeAttemptItem[]>(`/me/attempts?${query.toString()}`);
}

export function fetchMeResultsServer(page = 1): Promise<ApiSuccess<MeResultItem[]>> {
  return apiFetchServer<MeResultItem[]>(`/me/results?page=${page}`);
}

/** Own released result web view — same shape as the feature 05 public result. */
export function fetchMeResultDetailServer(attemptId: string): Promise<ApiSuccess<TestResultView>> {
  return apiFetchServer<TestResultView>(`/me/results/${attemptId}`);
}

/** Own issued certificates (ACTIVE and REVOKED), newest first. */
export function fetchMeCertificatesServer(page = 1): Promise<ApiSuccess<MeCertificateItem[]>> {
  return apiFetchServer<MeCertificateItem[]>(`/me/certificates?page=${page}`);
}

/** Own account row plus the declarations recorded on the latest attempt. */
export function fetchMeProfileServer(): Promise<ApiSuccess<MeProfile>> {
  return apiFetchServer<MeProfile>("/me/profile");
}
