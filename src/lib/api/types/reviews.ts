import type { ResultStatus } from "./enums";
import type { TestResultRow } from "./attempts";
import type { Interpretation } from "./tests";

/** Row of `GET /api/v1/psychologist/reviews` (ReviewListItem — enriched after approval). */
export interface ReviewListItem {
  resultId: string;
  testName: string;
  sessionTitle: string;
  participantName: string;
  participantEmail: string | null;
  institutionName: string | null;
  scores: unknown;
  patternCode: string;
  completedAt: string | null;
  status: Extract<ResultStatus, "PENDING_REVIEW" | "RETURNED" | "APPROVED">;
  reviewNote: string | null;
}

/**
 * Row of `GET /api/v1/admin/results` (AdminResultListItemDto — enriched backend
 * shape, verified 2026-09-06). `id` = result id (resubmit); `attemptId` = link
 * to the result detail page.
 */
export interface QueryResultsItem {
  id: string;
  attemptId: string;
  testName: string;
  sessionTitle: string;
  participantName: string;
  status: ResultStatus;
  patternCode: string | null;
  correctedPatternCode: string | null;
  completedAt: string | null;
}

/** `GET /api/v1/psychologist/reviews/:id` (ReviewDetail incl. per-item raw answers). */
export interface ReviewDetail {
  result: TestResultRow;
  test: {
    id: string;
    name: string;
    slug: string;
    scorerType: string;
    /** Seed-owned settings — a battery's subtest split lives here. */
    scoringConfig?: unknown;
  };
  session: { id: string; title: string };
  participant: { name: string; email?: string | null; candidateNumber?: string | null };
  attempt: { id: string; startedAt: string; completedAt: string | null };
  items: Array<{ id: string; order: number; content: Record<string, unknown> }>;
  responses: Array<{ itemId: string; value: unknown }>;
  interpretation: Interpretation | null;
  /** DISC raw answers per item: word lists + chosen most/least indexes. */
  itemsDetailed: Array<{
    itemOrder: number;
    words: string[];
    most: number;
    least: number;
  }>;
}

/** `POST /api/v1/psychologist/reviews/:id/approve` response. */
export interface ApproveResult {
  resultId: string;
  status: "APPROVED";
  /** 10-char public verification code — show once, copyable. */
  verifyCode: string;
}
