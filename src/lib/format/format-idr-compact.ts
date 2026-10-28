const compact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Axis-sized Rupiah: `Rp1,5 jt` instead of `Rp1.500.000`. */
export function formatIdrCompact(value: number): string {
  // Intl inserts a non-breaking space before the unit; keep it a plain space so
  // the string is predictable in tests and in SVG text.
  return `Rp${compact.format(value)}`.replace(/\u00a0/g, " ");
}
