const LETTERS = "ABCDEFGH";

/** Position letter for an option index: A, B, C… */
export function optionLetter(index: number): string {
  return LETTERS[index] ?? String(index + 1);
}

/** An option whose text only restates its own position: "a", "B", "3". */
function isPositional(option: string | undefined, index: number): boolean {
  const text = option?.trim() ?? "";
  if (!text) return false;
  return text.toLowerCase() === optionLetter(index).toLowerCase() || text === String(index + 1);
}

/**
 * True when the choices are printed inside the figure and the option array
 * only carries their position labels — CFIT stores "a"–"f", TIU 5 stores
 * "1"–"5". Rendering those beside a letter badge gives "A. a" and makes the
 * participant read two different labels for one choice.
 */
export function usesPositionalLabels(options: string[] | undefined): boolean {
  const list = options ?? [];
  return list.length > 0 && list.every((option, index) => isPositional(option, index));
}
