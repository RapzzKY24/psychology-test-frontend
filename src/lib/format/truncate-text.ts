/** Shortens a label for chart axes, keeping the ellipsis inside the limit. */
export function truncateText(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}
