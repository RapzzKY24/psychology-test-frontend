import type { ScorerType, TestCategory, TestStatus } from "./enums";

/** `GET /api/v1/tests` + `GET /api/v1/tests/:slug` (PublicTestSchema — safe fields only). */
export interface PublicTest {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: TestCategory;
  price: number;
  estimatedDurationMin: number;
}

/** Admin test row (`GET /api/v1/admin/tests`). */
export interface AdminTest extends PublicTest {
  status: TestStatus;
  scorerType: ScorerType;
  createdAt?: string;
  updatedAt?: string;
}

export interface RightWrongItemContent {
  question?: string;
  imageUrl?: string | null;
  options: string[];
  correctIndex: number;
  subtest?: string;
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
