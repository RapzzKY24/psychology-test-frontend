import type { ScorerType } from "@/lib/api/types";
import { DiscItemView } from "./components/disc-item-view";
import { RightWrongItemView } from "./components/right-wrong-item-view";

/**
 * ItemView registry — mirror of BE `SCORERS` (scorers/registry.ts).
 * 1 family = 1 scorer BE + 1 ItemView FE. Adding a test in an existing
 * family is data-only; a new family adds one entry here + one view file.
 */
export const ITEM_RENDERERS = {
  FORCED_CHOICE_DISC: DiscItemView,
  RIGHT_WRONG_NORM: RightWrongItemView,
} as const satisfies Record<ScorerType, React.ComponentType<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type RendererScorerType = keyof typeof ITEM_RENDERERS;

function isValidScorerType(value: unknown): value is ScorerType {
  return (
    typeof value === "string" &&
    (Object.keys(ITEM_RENDERERS) as string[]).includes(value)
  );
}

function sniffScorerType(
  items: Array<{ content: Record<string, unknown> }>,
): ScorerType {
  const first = items[0]?.content as { words?: unknown } | undefined;
  return Array.isArray(first?.words) ? "FORCED_CHOICE_DISC" : "RIGHT_WRONG_NORM";
}

/**
 * Prefer the explicit `scorerType` from `GET /attempts/:id` (sanitized BE
 * contract). Fall back to content sniffing for cached/legacy payloads.
 */
export function resolveScorerType(attempt: {
  scorerType?: unknown;
  items: Array<{ content: Record<string, unknown> }>;
}): ScorerType {
  if (isValidScorerType(attempt.scorerType)) return attempt.scorerType;
  return sniffScorerType(attempt.items);
}
