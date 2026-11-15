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

/** A three-option answer stores the picked index (0, 1 or 2); anything else is blank. */
export function toOptionChoice(value: unknown): number | null {
  const v = value as { chosen?: number } | undefined;
  return typeof v?.chosen === "number" && v.chosen >= 0 && v.chosen <= 2 ? v.chosen : null;
}

/** Likert answers store the picked rating; a non-number is blank. */
export function toRating(value: unknown): number | null {
  const v = value as { rating?: number } | undefined;
  return typeof v?.rating === "number" ? v.rating : null;
}

/**
 * Ranking answers store one rank per option, in option order; 0 means "not
 * ranked yet". Keeping the zero (instead of dropping the entry) lets the view
 * line a rank up with its occupation while the participant is still deciding.
 */
export function toRanks(value: unknown): number[] {
  const v = value as { ranks?: unknown } | undefined;
  if (!Array.isArray(v?.ranks)) return [];
  return v.ranks.map((rank) => (typeof rank === "number" ? rank : 0));
}

export interface MarkState {
  liked: number[];
  disliked: number[];
}

/**
 * A marked list stores the indexes it likes and the indexes it does not. Both
 * lists are read even when empty, so the view can render a row that has not
 * been touched yet without falling back to a draft.
 */
export function toMarks(value: unknown): MarkState {
  const v = value as { liked?: unknown; disliked?: unknown } | undefined;
  const indexes = (list: unknown) =>
    Array.isArray(list) ? list.filter((index): index is number => typeof index === "number") : [];
  return { liked: indexes(v?.liked), disliked: indexes(v?.disliked) };
}

/** One mark is enough: the participant may dislike nothing on a list. */
export function isAnsweredMarks(value: unknown): boolean {
  const marks = toMarks(value);
  return marks.liked.length + marks.disliked.length > 0;
}

/**
 * A timed grid stores one digit per gap, `null` for a gap left empty. The array
 * is position-keyed, so it is never trimmed: index 4 is the fifth gap whether
 * or not the earlier ones are filled.
 */
export function toTimedGridAnswers(value: unknown): (number | null)[] {
  const v = value as { answers?: unknown } | undefined;
  if (!Array.isArray(v?.answers)) return [];
  return v.answers.map((answer) => (typeof answer === "number" ? answer : null));
}

/** A lajur counts as answered once any gap holds a digit. */
export function isAnsweredTimedGrid(value: unknown): boolean {
  return toTimedGridAnswers(value).some((answer) => answer !== null);
}

/** A group counts as answered only when every option holds a rank. */
export function isAnsweredRanks(value: unknown): boolean {
  const ranks = toRanks(value);
  return ranks.length >= 2 && ranks.every((rank) => rank > 0);
}

/**
 * A drawing answer holds the server path of one PNG. There is no partial
 * state: the box is answered once an upload succeeded, and a failed upload
 * leaves the item blank.
 */
export function toManualImage(value: unknown): string | null {
  const v = value as { imageUrl?: unknown } | undefined;
  return typeof v?.imageUrl === "string" && v.imageUrl.length > 0 ? v.imageUrl : null;
}

export function isAnsweredManual(value: unknown): boolean {
  return toManualImage(value) !== null;
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
  if (
    scorerType === "FORCED_CHOICE_PAIR" ||
    scorerType === "PAIR_NORM" ||
    scorerType === "PAIR_TALLY" ||
    scorerType === "STYLE_GRID"
  ) {
    return toPairChoice(value) !== null;
  }
  if (scorerType === "LIKERT") return toRating(value) !== null;
  if (scorerType === "OPTION_SCALE") return toOptionChoice(value) !== null;
  if (scorerType === "RANK_GROUP") return isAnsweredRanks(value);
  if (scorerType === "MARK_GROUP") return isAnsweredMarks(value);
  if (scorerType === "MANUAL") return isAnsweredManual(value);
  if (scorerType === "TIMED_GRID") return isAnsweredTimedGrid(value);
  return isAnsweredRightWrong(value);
}
