import type { InvoiceStatus } from "@/lib/api/types";

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: "Menunggu Pembayaran",
  PAID: "Dibayar",
  CANCELLED: "Dibatalkan",
};

/** VA bank codes we display a friendly name for (fallback: raw code). */
export const BANK_CODE_LABEL: Record<string, string> = {
  "014": "BCA",
};

export function bankLabel(code: string | null): string {
  if (!code) return "Virtual Account";
  return `VA ${BANK_CODE_LABEL[code] ?? code}`;
}

/**
 * An UNPAID invoice past its `expiresAt` can no longer be paid — Snap rejects
 * the transaction, so the list hides the pay action instead of failing later.
 */
export function isInvoiceExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

/** How often the checkout page re-checks the invoice while it is UNPAID. */
export const INVOICE_POLL_MS = 4000;
