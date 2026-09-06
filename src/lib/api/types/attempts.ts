import type { AttemptStatus, ResultStatus, ScorerType } from "./enums";
import type { Interpretation } from "./tests";

/** DISC answer for one item (DiscResponseSchema, verified): word indexes 0–3, must differ. */
export interface DiscResponse {
  most: number;
  least: number;
}

/**
 * Body of `PUT /api/v1/public/attempts/:id/responses` (PutResponseSchema).
 * `value` is scorer-specific — for FORCED_CHOICE_DISC it is a DiscResponse.
 */
export interface PutResponseInput {
  itemId: string;
  value: DiscResponse;
}

/** `GET /api/v1/public/attempts/:id` (AttemptReadDto, verified). Items arrive sanitized: content only — never `mapping`. */
export interface AttemptRead {
  id: string;
  sessionId: string;
  testId: string;
  testName: string;
  status: AttemptStatus;
  startedAt: string;
  completedAt: string | null;
  items: Array<{ id: string; order: number; content: Record<string, unknown> }>;
  responses: Array<{ itemId: string; value: unknown }>;
}

/** `POST /api/v1/public/attempts/:id/complete` — idempotent. */
export interface AttemptComplete {
  id: string;
  testId: string;
  testName: string;
  status: AttemptStatus;
  completedAt: string;
  result: TestResultRow;
}

/** TestResult as returned by complete/admin views. */
export interface TestResultRow {
  id: string;
  attemptId: string;
  scores: Record<string, number>;
  patternCode: string;
  status: ResultStatus;
  correctedScores?: Record<string, number> | null;
  correctedPatternCode?: string | null;
  correctionReason?: string | null;
  notes?: string | null;
  reviewNote?: string | null;
  verifyCode?: string | null;
  computedAt?: string;
  reviewedAt?: string | null;
}

/** `GET /api/v1/public/attempts/:id/result` (released view; 403 result_not_released pre-approval). */
export interface TestResultView {
  patternCode: string;
  scores: Record<string, number>;
  interpretation: Interpretation | null;
  completedAt: string;
}

/** `GET /api/v1/admin/attempts/:id/result` — admin sees system + corrected scores. */
export interface AdminResultView {
  result: TestResultRow;
  interpretation: Interpretation | null;
}

/** Row of `GET /api/v1/me/results` (feature 08 contract). */
export interface MeResultItem {
  attemptId: string;
  testName: string;
  patternCode: string;
  completedAt: string;
  approvedAt: string;
}

/** Row of `GET /api/v1/me/attempts` (own attempts in any status — dashboard). */
export interface MeAttemptItem {
  id: string;
  testId: string;
  testName: string;
  status: AttemptStatus;
  startedAt: string;
  completedAt: string | null;
  sessionId: string;
  sessionTitle: string;
  resultStatus: ResultStatus | null;
}

/** Scorer registry key — the attempt runner picks a renderer by this (renderer registry). */
export type RunnerScorerType = ScorerType;
