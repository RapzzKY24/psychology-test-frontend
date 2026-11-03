import type { RightWrongItemContentInput } from "./schemas";

const KEY_LETTERS = "ABCDEF";

export interface ImportParseResult {
  items: RightWrongItemContentInput[];
  errors: string[];
}

/**
 * One item per line: `pertanyaan | opsi A | opsi B | ... | kunci`.
 *
 * The whole paste is rejected when any line fails, so a typo on line 12 never
 * leaves half a test behind. The key accepts the option letter (A–F) or the
 * exact option text, whichever the admin copied from their source document.
 */
export function parseRightWrongImport(raw: string): ImportParseResult {
  const items: RightWrongItemContentInput[] = [];
  const errors: string[] = [];

  raw.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const lineNo = index + 1;
    const fields = trimmed.split("|").map((field) => field.trim());

    if (fields.length < 4) {
      errors.push(`Baris ${lineNo}: butuh pertanyaan, minimal 2 opsi, dan kunci.`);
      return;
    }
    if (fields.length > 7) {
      errors.push(`Baris ${lineNo}: maksimal 6 opsi.`);
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

    const correctIndex = resolveKey(key, options);
    if (correctIndex === -1) {
      errors.push(`Baris ${lineNo}: kunci "${key}" tidak cocok dengan opsi mana pun.`);
      return;
    }

    items.push({ question, options, correctIndex });
  });

  return { items, errors };
}

function resolveKey(key: string, options: string[]): number {
  if (key.length === 1) {
    const letter = KEY_LETTERS.indexOf(key.toUpperCase());
    if (letter >= 0) return letter < options.length ? letter : -1;
  }
  return options.findIndex((option) => option.toLowerCase() === key.toLowerCase());
}
