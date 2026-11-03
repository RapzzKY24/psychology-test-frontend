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
