import type { AttemptStatus, ResultStatus, ScorerType } from "./enums";
import type { Interpretation } from "./tests";

/** DISC answer for one item (DiscResponseSchema, verified): word indexes 0–3, must differ. */
export interface DiscResponse {
  most: number;
  least: number;
}

/** One marked list: `liked` and `disliked` hold option indexes and never overlap. */
export interface MarkGroupResponse {
  liked: number[];
  disliked: number[];
}

/** Right/wrong answer: `chosen` for choice items (1 index = radio), `text` for short items. */
export interface RightWrongResponse {
  chosen?: number[];
  text?: string;
}

/** Likert answer: one rating inside the test's own scale. */
export interface LikertResponse {
  rating: number;
}

/** Three-option answer: the index of the picked option (0 = a). */
export interface OptionScaleResponse {
  chosen: number;
}

/**
 * Ranking answer: one rank per option, `ranks[optionIndex]` counting from 1.
 * Every number from 1..N appears exactly once, so a half-filled group is not a
 * valid answer (the API rejects it).
 */
export interface RankGroupResponse {
  ranks: number[];
}

/** `MALE` / `FEMALE` — declared once when the instrument ships two item lists. */
export type Gender = "MALE" | "FEMALE";

/** Schooling level — declared once when the norm is banded by education (16PF). */
export type Education = "SMP_SMA" | "S1" | "UMUM";

/**
 * Drawing answer: the server-owned path of the saved PNG. The participant
 * never sends a path of their own — the upload route writes the file and
 * returns this value, so a row can only point at its own attempt.
 */
export interface ManualResponse {
  imageUrl: string;
}

/**
 * One answer for every shape of a multi-subtest battery: the letter that was
 * crossed, the number that was written, or the word that was typed. The scorer
 * compares it against the item's own key, so the client never says what kind of
 * answer it is.
 */
export interface MultiSubtestResponse {
  answer: string;
}

/**
 * One subtest of a battery, with the window its answers are accepted in.
 * Offsets count seconds from `startedAt`, so the client can place the clock
 * without knowing the battery's own layout.
 */
export interface AttemptSubtest {
  code: string;
  name: string;
  kind: string;
  instruction: string;
  /** Item order range, both inclusive. */
  itemFrom: number;
  itemTo: number;
  /** Seconds after `startedAt` when the answering window opens. */
  startOffsetSec: number;
  /** Seconds the answering window lasts. */
  durationSec: number;
  /** Seconds of printed-list study before the window opens (ME only). */
  memorizeSec: number;
  /** The printed list itself, shown during `memorizeSec`. */
  memorizeList: Array<{ label: string; words: string[] }>;
}

/**
 * Body of `PUT /api/v1/public/attempts/:id/responses` (PutResponseSchema).
 * `value` is scorer-specific.
 */
export interface PutResponseInput {
  itemId: string;
  value:
    | DiscResponse
    | LikertResponse
    | ManualResponse
    | MarkGroupResponse
    | MultiSubtestResponse
    | OptionScaleResponse
    | RankGroupResponse
    | RightWrongResponse;
}

/** `GET /api/v1/public/attempts/:id` (AttemptReadDto, verified). Items arrive sanitized: content only — never `mapping`/`correctIndex`. */
export interface AttemptRead {
  id: string;
  sessionId: string;
  testId: string;
  testName: string;
  scorerType: ScorerType;
  status: AttemptStatus;
  startedAt: string;
  completedAt: string | null;
  /** Hard limit in minutes; null = untimed. */
  timeLimitMin: number | null;
  /** Seconds left, computed by the server from `startedAt + timeLimitMin`. */
  remainingSeconds: number | null;
  /** The item list differs by sex, so the client must declare one first. */
  requiresGender: boolean;
  /** Declared sex; null on a test that does not ask. */
  gender: Gender | null;
  /** The norm is banded by schooling, so the client must declare one first. */
  requiresEducation: boolean;
  /** Declared schooling; null on a test that does not ask. */
  education: Education | null;
  /**
   * Windows of a multi-subtest battery, in printed order. Empty for every other
   * family — a single-clock test has nothing to place.
   */
  subtests: AttemptSubtest[];
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
  /** The family that scored it — `/hasil` shows a neutral card for TIMED_GRID. */
  scorerType?: ScorerType;
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
  reviewNote: string | null;
}

/** Scorer registry key — the attempt runner picks a renderer by this (renderer registry). */
export type RunnerScorerType = ScorerType;
