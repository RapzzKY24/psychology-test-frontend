const DAY_FORMAT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

/** `2026-10-28` → `28 Okt` for chart axes and tooltips. */
export function formatDayShort(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return DAY_FORMAT.format(new Date(Date.UTC(year, month - 1, day)));
}
