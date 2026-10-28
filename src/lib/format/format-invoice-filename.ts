/**
 * Nama file unduhan invoice. Nomor invoice boleh memuat "/" dan spasi, yang
 * akan memotong path kalau dipakai apa adanya.
 */
export function formatInvoiceFilename(number: string): string {
  return `Invoice-${number.replace(/[^A-Za-z0-9._-]+/g, "-")}.pdf`;
}
