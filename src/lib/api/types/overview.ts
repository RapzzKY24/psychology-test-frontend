/**
 * `GET /api/v1/me/overview` — the dashboard's first screen in one request:
 * four counts, three previews, and the raw events behind the activity list.
 */
export interface MeOverviewCounts {
  inProgress: number;
  awaitingReview: number;
  resultsReady: number;
  certificatesReady: number;
}

export interface ActiveAttemptSummary {
  attemptId: string;
  testName: string;
  startedAt: string;
}

export interface LatestResultSummary {
  attemptId: string;
  testName: string;
  patternCode: string;
  approvedAt: string | null;
}

export interface LatestCertificateSummary {
  id: string;
  number: string;
  testName: string;
  issuedAt: string;
}

export interface LatestOrderSummary {
  orderId: string;
  testName: string;
  amount: number;
  paidAt: string;
}

export interface CompletedAttemptSummary {
  attemptId: string;
  testName: string;
  completedAt: string;
}

export interface MeOverview {
  counts: MeOverviewCounts;
  activeAttempts: ActiveAttemptSummary[];
  latestResults: LatestResultSummary[];
  latestCertificates: LatestCertificateSummary[];
  latestOrders: LatestOrderSummary[];
  latestCompletedAttempts: CompletedAttemptSummary[];
}
