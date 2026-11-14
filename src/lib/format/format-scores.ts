/** `RAW_22` is the raw score spelled out again — the summary already carries it. */
const RAW_CODE = /^RAW_\d+$/i;

/** Entries shown before a summary is cut short; MBTI has 8, DISC 4. */
const MAX_ENTRIES = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Pattern codes a reader should not be shown: they repeat the score. */
export function isRawPatternCode(code: string | null | undefined): boolean {
  return RAW_CODE.test(code?.trim() ?? "");
}

function numbersText(values: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "number") continue;
    parts.push(`${key} ${value}`);
    if (parts.length === MAX_ENTRIES) break;
  }
  return parts.join(" · ");
}

/**
 * One line per family, because the JSONB shape is not the same everywhere:
 * right/wrong carries `raw`/`total`, MBTI carries a `type`, DISC carries a
 * `graph` of D/I/S/C. Never throws — a malformed score must not break a list.
 */
export function scoreSummaryText(scores: unknown): string {
  if (!isRecord(scores)) return "—";

  const { raw, total, iq } = scores;
  if (typeof raw === "number" && typeof total === "number") {
    const parts = [`${raw}/${total} benar`];
    if (typeof iq === "number") parts.push(`IQ ${iq}`);
    return parts.join(" · ");
  }

  const type = scores.type;
  if (typeof type === "string" && type.trim()) return type.trim();

  if (isRecord(scores.graph)) {
    const text = numbersText(scores.graph);
    if (text) return text;
  }

  return numbersText(scores) || "—";
}

/** Table-cell preview: the pattern code, then the score summary. */
export function safeRenderScores(scores: unknown, patternCode: string): string {
  const summary = scoreSummaryText(scores);
  const code = patternCode?.trim() ?? "";
  const showCode = Boolean(code) && !isRawPatternCode(code) && code !== summary;

  if (!showCode) return summary;
  return summary === "—" ? code : `${code} · ${summary}`;
}
