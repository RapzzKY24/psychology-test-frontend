const MONTH_FORMAT = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "2-digit",
});

/** `2026-10` → `Okt 26` for chart axes and tooltips. */
export function formatMonthShort(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) return month;
  return MONTH_FORMAT.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}
