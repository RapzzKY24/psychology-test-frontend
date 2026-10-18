import type { InvoiceStatus } from "@/lib/api/types";

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: "Menunggu Pembayaran",
  PAID: "Dibayar",
  CANCELLED: "Dibatalkan",
};

/** GDC bank codes we display a friendly name for (fallback: raw code). */
export const BANK_CODE_LABEL: Record<string, string> = {
  "014": "BCA",
};

export function bankLabel(code: string | null): string {
  if (!code) return "Virtual Account";
  return `VA ${BANK_CODE_LABEL[code] ?? code}`;
}

/** How often the checkout page re-checks the invoice while it is UNPAID. */
export const INVOICE_POLL_MS = 4000;
