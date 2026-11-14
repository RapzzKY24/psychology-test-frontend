import type { RightWrongItemContentInput } from "./schemas";

const KEY_LETTERS = "ABCDEFGH";

export interface ImportParseResult {
  items: RightWrongItemContentInput[];
  errors: string[];
}

/**
 * One item per line. Two shapes, told apart by the column count:
 *
 *   pertanyaan | jawaban              → isian singkat (";" separates variants)
 *   pertanyaan | A | B | C | kunci    → pilihan ganda ("A,D" for a multi key)
 *
 * The whole paste is rejected when any line fails, so a typo on line 12 never
 * leaves half a test behind. A choice key accepts the option letter (A–F) or
 * the exact option text, whichever the admin copied from the source document.
 */
export function parseRightWrongImport(raw: string): ImportParseResult {
  const items: RightWrongItemContentInput[] = [];
  const errors: string[] = [];

  raw.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const lineNo = index + 1;
    const fields = trimmed.split("|").map((field) => field.trim());

    if (fields.length === 2) {
      const [question, answer] = fields;
      if (!question) {
        errors.push(`Baris ${lineNo}: pertanyaan kosong.`);
        return;
      }
      const accepted = answer
        .split(";")
        .map((variant) => variant.trim())
        .filter(Boolean);
      if (accepted.length === 0) {
        errors.push(`Baris ${lineNo}: jawaban kosong.`);
        return;
      }
      items.push({ answerMode: "short", question, imageUrl: null, accepted });
      return;
    }

    if (fields.length < 4) {
      errors.push(
        `Baris ${lineNo}: butuh pertanyaan, minimal 2 opsi, dan kunci — atau 2 kolom untuk isian singkat.`,
      );
      return;
    }
    if (fields.length > 10) {
      errors.push(`Baris ${lineNo}: maksimal 8 opsi.`);
      return;
    }

    const question = fields[0];
    const options = fields.slice(1, -1);
    const key = fields[fields.length - 1];

    if (!question) {
      errors.push(`Baris ${lineNo}: pertanyaan kosong.`);
      return;
    }
    if (options.some((option) => option.length === 0)) {
      errors.push(`Baris ${lineNo}: ada opsi yang kosong.`);
      return;
    }

    const correctIndexes = resolveKey(key, options);
    if (!correctIndexes) {
      errors.push(`Baris ${lineNo}: kunci "${key}" tidak cocok dengan opsi mana pun.`);
      return;
    }

    items.push({ answerMode: "choice", question, imageUrl: null, options, correctIndexes });
  });

  return { items, errors };
}

/** `"A,D"` / `"1,4"` / `"ya"` → sorted zero-based indexes, null when unknown. */
function resolveKey(key: string, options: string[]): number[] | null {
  const parts = key
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  const indexes = parts.map((part) => resolveSingleKey(part, options));
  if (indexes.some((idx) => idx === -1)) return null;
  return [...new Set(indexes)].sort((a, b) => a - b);
}

function resolveSingleKey(part: string, options: string[]): number {
  if (part.length === 1) {
    const letter = KEY_LETTERS.indexOf(part.toUpperCase());
    if (letter >= 0) return letter < options.length ? letter : -1;
  }
  // Numeric keys ("1", "4") count from 1, matching how the source sheets number
  // their options; a bare number is only read that way when no option matches.
  const byText = options.findIndex((option) => option.toLowerCase() === part.toLowerCase());
  if (byText >= 0) return byText;
  if (/^\d+$/.test(part)) {
    const idx = Number(part) - 1;
    if (idx >= 0 && idx < options.length) return idx;
  }
  return -1;
}
