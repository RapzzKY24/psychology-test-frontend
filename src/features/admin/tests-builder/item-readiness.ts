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

/** Both statements filled and mapped to two different poles. */
export function isPairItemReady(content: PairItemDraft | undefined): boolean {
  if (!content) return false;
  if (!content.question?.trim()) return false;
  const statements = content.statements ?? [];
  if (statements.length !== 2 || !statements.every((s) => s.trim().length > 0)) return false;
  const mapping = (content.mapping ?? []).map((p) => p.trim().toUpperCase());
  return mapping.length === 2 && Boolean(mapping[0]) && Boolean(mapping[1]) && mapping[0] !== mapping[1];
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
