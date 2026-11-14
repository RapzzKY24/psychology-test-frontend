/** Norm age band, in completed months (14y0m = 168). */
export interface AgeBand {
  minMonths: number;
  maxMonths: number;
}

export type AgeBandStatus = "unknown" | "inside" | "below" | "above";

/**
 * Parses the value of `<input type="date">` as a local calendar date. Using
 * `new Date("2000-01-01")` instead would read it as UTC midnight and shift the
 * day in western time zones.
 */
export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? date : null;
}

/** Completed months between two dates — the unit the norm tables use. */
export function ageInMonths(birth: Date, at: Date): number {
  let months = (at.getFullYear() - birth.getFullYear()) * 12 + (at.getMonth() - birth.getMonth());
  if (at.getDate() < birth.getDate()) months -= 1;
  return months;
}

export function checkAgeBand(ageMonths: number, band: AgeBand): AgeBandStatus {
  if (ageMonths < band.minMonths) return "below";
  if (ageMonths > band.maxMonths) return "above";
  return "inside";
}

/** "14 tahun 3 bulan" — omits the month part when it is zero. */
export function formatAge(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} bulan`;
  return rest === 0 ? `${years} tahun` : `${years} tahun ${rest} bulan`;
}

/** "14 tahun 0 bulan – 14 tahun 11 bulan" — keeps the zero to show the range. */
export function formatAgeBand(band: AgeBand): string {
  const edge = (months: number) => `${Math.floor(months / 12)} tahun ${months % 12} bulan`;
  return `${edge(band.minMonths)} – ${edge(band.maxMonths)}`;
}
