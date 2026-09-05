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

/**
 * DISC forced-choice item content (DiscItemContentSchema in
 * src/scorers/schemas/forced-choice-disc.ts, verified). `*` marks a neutral word.
 */
export interface DiscItemContent {
  words: [string, string, string, string];
  mostMapping: ["D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*"];
  leastMapping: ["D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*", "D" | "I" | "S" | "C" | "*"];
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
