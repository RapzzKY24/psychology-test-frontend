/**
 * One-line score preview for table cells: pattern code plus a truncated JSON
 * blob. Never throws — a malformed score must not break a list.
 */
export function safeRenderScores(scores: unknown, patternCode: string): string {
  const code = patternCode?.trim() ?? "";
  if (!code) return "—";
  if (scores == null || scores === "") return code;
  try {
    const graph = (scores as { graph?: unknown })?.graph ?? scores;
    const text = JSON.stringify(graph);
    const truncated = text.length > 60 ? `${text.slice(0, 60)}…` : text;
    return `${code} · ${truncated}`;
  } catch {
    return code;
  }
}
