import type { RightWrongItemContent } from "@/lib/api/types";

const LETTERS = "ABCDEF";

function letter(index: number): string {
  return LETTERS[index] ?? String(index + 1);
}

/**
 * Answers arrive in two shapes: `{ chosen: 2 }` from rows written before
 * 2026-11 and `{ chosen: [2] }` after. The review table only ever needs the
 * list, so the conversion lives here.
 */
export function chosenIndexes(value: unknown): number[] {
  const raw = value as { chosen?: number | number[] } | undefined;
  if (Array.isArray(raw?.chosen)) return raw.chosen;
  if (typeof raw?.chosen === "number") return [raw.chosen];
  return [];
}

export function answerText(value: unknown): string {
  const raw = value as { text?: string } | undefined;
  return typeof raw?.text === "string" ? raw.text.trim() : "";
}

export function isShortItem(content: RightWrongItemContent | undefined): boolean {
  return content?.answerMode === "short";
}

/** "A. Jakarta, C. Bandung"; falls back to the bare letter when an option is gone. */
export function choiceLabel(options: string[] | undefined, indexes: number[]): string {
  if (indexes.length === 0) return "—";
  return indexes
    .map((index) => {
      const option = options?.[index];
      return option ? `${letter(index)}. ${option}` : letter(index);
    })
    .join(", ");
}

export function keyIndexes(content: RightWrongItemContent | undefined): number[] {
  if (!content) return [];
  if (content.correctIndexes) return content.correctIndexes;
  return typeof content.correctIndex === "number" ? [content.correctIndex] : [];
}

/** The key as text: options for a choice item, the accepted variants for a short one. */
export function keyLabel(content: RightWrongItemContent | undefined): string {
  if (!content) return "—";
  if (isShortItem(content)) {
    return content.accepted?.filter(Boolean).join(" / ") || "—";
  }
  return choiceLabel(content.options, keyIndexes(content));
}

/** What the participant actually answered, as text. */
export function responseLabel(
  content: RightWrongItemContent | undefined,
  value: unknown,
): string {
  if (isShortItem(content)) return answerText(value) || "—";
  return choiceLabel(content?.options, chosenIndexes(value));
}
