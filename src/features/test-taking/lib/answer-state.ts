import type { ScorerType } from "@/lib/api/types";
import type { DiscResponse } from "../schemas";

/**
 * Every answer shape a scorer family can produce, in one place. Both the runner
 * and the save queue need to agree on "is this item answered", so the rule lives
 * here instead of being re-implemented per hook.
 */

/** Legacy rows stored a bare number; the runner always works with an array. */
export function toChosen(value: unknown): number[] {
  const v = value as { chosen?: number | number[] } | undefined;
  if (Array.isArray(v?.chosen)) return v.chosen;
  if (typeof v?.chosen === "number") return [v.chosen];
  return [];
}

export function toText(value: unknown): string {
  const v = value as { text?: string } | undefined;
  return typeof v?.text === "string" ? v.text : "";
}

/** Pair answers store the picked statement index (0 or 1); anything else is blank. */
export function toPairChoice(value: unknown): number | null {
  const v = value as { chosen?: number } | undefined;
  return typeof v?.chosen === "number" && v.chosen >= 0 && v.chosen <= 1 ? v.chosen : null;
}

/** Likert answers store the picked rating; a non-number is blank. */
export function toRating(value: unknown): number | null {
  const v = value as { rating?: number } | undefined;
  return typeof v?.rating === "number" ? v.rating : null;
}

export function isAnsweredDisc(value: unknown): value is DiscResponse {
  const v = value as DiscResponse | undefined;
  return v !== undefined && v.most >= 0 && v.least >= 0;
}

export function isAnsweredRightWrong(value: unknown): boolean {
  return toChosen(value).length > 0 || toText(value).trim().length > 0;
}

/** One definition of "answered" for the progress rail and the finish guard. */
export function isAnsweredValue(scorerType: ScorerType, value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (scorerType === "FORCED_CHOICE_DISC") return isAnsweredDisc(value);
  if (scorerType === "FORCED_CHOICE_PAIR" || scorerType === "PAIR_TALLY") {
    return toPairChoice(value) !== null;
  }
  if (scorerType === "LIKERT") return toRating(value) !== null;
  return isAnsweredRightWrong(value);
}
