/**
 * A right/wrong item is publishable when it has something to show (question
 * text or an image) and every option is filled. The rail badge uses this so a
 * half-typed row never looks finished.
 */
export interface RightWrongItemDraft {
  question?: string;
  imageUrl?: string | null;
  options?: string[];
}

export function isRightWrongItemReady(content: RightWrongItemDraft | undefined): boolean {
  if (!content) return false;
  const hasPrompt = Boolean(content.question?.trim() || content.imageUrl);
  const optionsReady =
    Boolean(content.options?.length) &&
    content.options!.every((option) => option.trim().length > 0);
  return hasPrompt && optionsReady;
}
