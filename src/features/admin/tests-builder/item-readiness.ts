/**
 * A right/wrong item is publishable when it has something to show (question
 * text or an image) and a usable key: filled options plus at least one tick,
 * or at least one non-empty accepted answer. The rail badge uses this so a
 * half-typed row never looks finished.
 */
export interface RightWrongItemDraft {
  answerMode?: "choice" | "short";
  question?: string;
  imageUrl?: string | null;
  options?: string[];
  correctIndexes?: number[];
  accepted?: string[];
}

export interface PairItemDraft {
  question?: string;
  statements?: string[];
  mapping?: string[];
}

export interface ScaleTallyItemDraft {
  question?: string;
  options?: string[];
  scale?: string;
}

/** A tally item needs the statement, both labels and the scale it feeds. */
export function isScaleTallyItemReady(content: ScaleTallyItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const options = content.options ?? [];
  if (options.length !== 2 || !options.every((o) => o.trim().length > 0)) return false;
  return /^[A-Za-z]{1,4}$/.test(content.scale?.trim() ?? "");
}

export interface ChoiceTallyItemDraft {
  question?: string;
  options?: string[];
  mapping?: string[];
}

/** Every option filled, and every option carrying its own scale code. */
export function isChoiceTallyItemReady(content: ChoiceTallyItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const options = content.options ?? [];
  const mapping = content.mapping ?? [];
  if (options.length < 2 || options.length !== mapping.length) return false;
  if (!options.every((o) => o.trim().length > 0)) return false;
  return mapping.every((scale) => /^[A-Za-z]{1,4}$/.test(scale.trim()));
}

export interface LikertItemDraft {
  text?: string;
  scale?: string;
  reverse?: boolean;
}

/** A Likert item needs the statement and the scale its rating feeds. */
export function isLikertItemReady(content: LikertItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.text?.trim()) return false;
  return /^[A-Za-z]{1,12}$/.test(content.scale?.trim() ?? "");
}

export interface OptionScaleItemDraft {
  text?: string;
  options?: string[];
  scale?: string;
  points?: number[];
}

/** A three-option item needs the statement, all three answers and its factor. */
export function isOptionScaleItemReady(content: OptionScaleItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.text?.trim()) return false;
  const options = content.options ?? [];
  if (options.length !== 3 || !options.every((option) => option.trim().length > 0)) return false;
  return /^[A-Za-z][A-Za-z0-9]{0,11}$/.test(content.scale?.trim() ?? "");
}

/** Both statements filled and mapped to two different poles. */export function isPairItemReady(content: PairItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const statements = content.statements ?? [];
  if (statements.length !== 2 || !statements.every((s) => s.trim().length > 0)) return false;
  const mapping = (content.mapping ?? []).map((p) => p.trim().toUpperCase());
  return mapping.length === 2 && Boolean(mapping[0]) && Boolean(mapping[1]) && mapping[0] !== mapping[1];
}

/**
 * A style-grid row needs both statements and both keys, but the keys may be the
 * same — MSDT's diagonal item scores one style on both sides.
 */
export function isStyleGridItemReady(content: PairItemDraft | undefined): boolean {
  if (!content) return false;
  const statements = content.statements ?? [];
  if (statements.length !== 2 || !statements.every((s) => s.trim().length > 0)) return false;
  const mapping = (content.mapping ?? []).map((p) => p.trim().toUpperCase());
  return mapping.length === 2 && Boolean(mapping[0]) && Boolean(mapping[1]);
}

/**
 * A normed pair needs both statements and both need codes, and the codes may be
 * the same — EPPS's diagonal item scores one need on both sides on purpose.
 */
export function isPairNormItemReady(content: PairItemDraft | undefined): boolean {
  return isStyleGridItemReady(content);
}

export interface RankGroupItemDraft {
  question?: string;
  options?: string[];
  femaleOptions?: string[];
  mapping?: string[];
}

/**
 * A rank group needs a label, at least two occupations with one field code
 * each, and — when it has a female list at all — the same number of entries on
 * both sides.
 */
export function isRankGroupItemReady(content: RankGroupItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const options = content.options ?? [];
  const mapping = content.mapping ?? [];
  if (options.length < 2 || options.length !== mapping.length) return false;
  if (!options.every((option) => option.trim().length > 0)) return false;
  if (!mapping.every((field) => /^[A-Za-z][A-Za-z.]{0,5}$/.test(field.trim()))) return false;
  const female = content.femaleOptions ?? [];
  if (female.length === 0) return true;
  return (
    female.length === options.length && female.every((option) => option.trim().length > 0)
  );
}

export interface MarkGroupItemDraft {
  question?: string;
  options?: string[];
  mapping?: string[][];
  verification?: number[];
}

/**
 * A marked list needs a label, at least two activities and a field list for
 * each of them. An activity may load on no field at all (Kuder's
 * verification-only rows), so an empty list is fine — a missing one is not.
 */
export function isMarkGroupItemReady(content: MarkGroupItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const options = content.options ?? [];
  const mapping = content.mapping ?? [];
  if (options.length < 2 || options.length !== mapping.length) return false;
  if (!options.every((option) => option.trim().length > 0)) return false;
  return mapping.every((fields) =>
    fields.every((field) => /^[A-Za-z][A-Za-z.]{0,5}$/.test(field.trim())),
  );
}

export function isRightWrongItemReady(content: RightWrongItemDraft | undefined): boolean {
  if (!content) return false;
  const hasPrompt = Boolean(content.question?.trim() || content.imageUrl);
  if (!hasPrompt) return false;

  if (content.answerMode === "short") {
    return Boolean(content.accepted?.some((variant) => variant.trim().length > 0));
  }

  const optionsReady =
    Boolean(content.options?.length) &&
    content.options!.every((option) => option.trim().length > 0);
  return optionsReady && Boolean(content.correctIndexes?.length);
}
