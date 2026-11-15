import type { ScorerType } from "@/lib/api/types";
import { DiscItemView } from "./components/disc-item-view";
import { LikertItemView } from "./components/likert-item-view";
import { ManualItemView } from "./components/manual-item-view";
import { MarkGroupItemView } from "./components/mark-group-item-view";
import { MultiSubtestItemView } from "./components/multi-subtest-item-view";
import { OptionScaleItemView } from "./components/option-scale-item-view";
import { PairItemView } from "./components/pair-item-view";
import { RankGroupItemView } from "./components/rank-group-item-view";
import { RightWrongItemView } from "./components/right-wrong-item-view";
import { TimedGridItemView } from "./components/timed-grid-item-view";

/**
 * ItemView registry — mirror of BE `SCORERS` (scorers/registry.ts).
 * 1 family = 1 scorer BE + 1 ItemView FE. Adding a test in an existing
 * family is data-only; a new family adds one entry here + one view file.
 */
export const ITEM_RENDERERS = {
  FORCED_CHOICE_DISC: DiscItemView,
  FORCED_CHOICE_PAIR: PairItemView,
  // A Likert item is one statement plus a rating scale — its own view.
  LIKERT: LikertItemView,
  // A drawing box is a canvas with a printed mark under it — the answer is a
  // picture, not a value, so no other view can stand in for it.
  MANUAL: ManualItemView,
  // A marked list draws one row per activity with a + and a - column — the
  // shape of the answer sheet, not of any other family.
  MARK_GROUP: MarkGroupItemView,
  // A battery prints four shapes of item under one cover; the runner picks the
  // shape from the item's own `kind`, so one view covers all nine subtests.
  MULTI_SUBTEST: MultiSubtestItemView,
  // A three-option statement draws its answers as text buttons (a/b/c) — the
  // pair view only has two sides and the right/wrong view sends an array.
  OPTION_SCALE: OptionScaleItemView,
  // A pair tally asks the same question ("pick one of two statements"); only
  // the scoring differs — every statement feeds a named scale.
  PAIR_TALLY: PairItemView,
  // A normed pair tally is the same screen: EPPS picks one of two statements
  // and the percentile table is read server-side.
  PAIR_NORM: PairItemView,
  // A style grid is the same pick-one-of-two screen; the tally behind it rolls
  // the scales up into dimensions before it names a style.
  STYLE_GRID: PairItemView,
  // A ranking group shows one list of occupations per item and asks for an
  // order, not a pick — it needs its own view.
  RANK_GROUP: RankGroupItemView,
  RIGHT_WRONG_NORM: RightWrongItemView,
  // A tally item is a statement with two labels ("Ya"/"Tidak"), which is the
  // same shape the right/wrong view already draws.
  SCALE_TALLY: RightWrongItemView,
  // A choice tally is a question with N options — also the right/wrong shape.
  CHOICE_TALLY: RightWrongItemView,
  // A digit grid draws one lajur at a time with a box between each pair of
  // digits; no other family has a row of answers inside one item.
  TIMED_GRID: TimedGridItemView,
} as const satisfies Record<ScorerType, React.ElementType>;

export type RendererScorerType = keyof typeof ITEM_RENDERERS;

function isValidScorerType(value: unknown): value is ScorerType {
  return typeof value === "string" && (Object.keys(ITEM_RENDERERS) as string[]).includes(value);
}

function sniffScorerType(items: Array<{ content: Record<string, unknown> }>): ScorerType {
  const first = items[0]?.content as
    | { words?: unknown; statements?: unknown; digits?: unknown; mark?: unknown }
    | undefined;
  if (Array.isArray(first?.words)) return "FORCED_CHOICE_DISC";
  if (Array.isArray(first?.digits)) return "TIMED_GRID";
  // A drawing box carries the printed mark instead of any text to answer.
  if (typeof first?.mark === "string") return "MANUAL";
  if (Array.isArray(first?.statements)) return "FORCED_CHOICE_PAIR";
  return "RIGHT_WRONG_NORM";
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
