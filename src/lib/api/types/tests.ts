import type { ScorerType, TestCategory, TestStatus } from "./enums";

/** `GET /api/v1/tests` + `GET /api/v1/tests/:slug` (PublicTestSchema — safe fields only). */
export interface PublicTest {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Cover image path (`/uploads/test-covers/...`); null when not uploaded. */
  imageUrl: string | null;
  category: TestCategory;
  price: number;
  estimatedDurationMin: number;
}

/** Admin test row (`GET /api/v1/admin/tests`). */
export interface AdminTest extends PublicTest {
  status: TestStatus;
  scorerType: ScorerType;
  /** Hard limit enforced from `startedAt`; null = untimed. */
  timeLimitMin: number | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Right/wrong item content (RightWrongItemContentSchema). One scorer, two answer
 * shapes: `choice` keeps the key in `correctIndexes` (1 = radio, >1 = checkbox)
 * and `short` keeps a list of accepted variants. The participant never receives
 * either key — `sanitize` strips them.
 */
export interface RightWrongItemContent {
  answerMode: "choice" | "short";
  question?: string;
  imageUrl?: string | null;
  subtest?: string;
  /** choice only */
  options?: string[];
  /** choice only — the answer key */
  correctIndexes?: number[];
  /** short only — accepted variants, never sent to the participant */
  accepted?: string[];
}

/** Builder payload (`GET /api/v1/admin/tests/:id` — merged 2026-09-05, PR #6). */
export interface AdminTestItem {
  id: string;
  order: number;
  content: DiscItemContent | RightWrongItemContent;
}

export interface AdminTestDetail extends AdminTest {
  items: AdminTestItem[];
  interpretations: Interpretation[];
}

/** Body of `POST /api/v1/admin/tests` (CreateTestSchema, verified). */
export interface CreateTestInput {
  name: string;
  slug: string;
  description: string;
  category: TestCategory;
  scorerType: ScorerType;
  price: number;
  estimatedDurationMin: number;
}

export type UpdateTestInput = Partial<CreateTestInput>;

export type DiscMapping = "D" | "I" | "S" | "C" | "*";

/**
 * DISC forced-choice item content (DiscItemContentSchema in
 * src/scorers/schemas/forced-choice-disc.ts, verified). `*` marks a neutral word.
 * Arrays are length-4 at runtime — enforced by Zod on both sides.
 */
export interface DiscItemContent {
  words: string[];
  mostMapping: DiscMapping[];
  leastMapping: DiscMapping[];
}

/** Body of `PUT /api/v1/admin/tests/:id/items` (PutItemsSchema — content validated per scorerType in the service). */
export interface PutItemsInput {
  items: Array<{ content: DiscItemContent }>;
}

/** Body of `PUT /api/v1/admin/tests/:id/interpretations` (keyed by patternCode). */
export interface PutInterpretationsInput {
  interpretations: Array<{
    patternCode: string;
    title: string;
    body: string;
  }>;
}

/** Interpretation row (public/me result views embed the matched one). */
export interface Interpretation {
  id?: string;
  testId?: string;
  patternCode: string;
  title: string;
  body: string;
}
