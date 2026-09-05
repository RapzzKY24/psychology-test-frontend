import { z } from "zod";
import { INVOICE_STATUSES } from "@/lib/api/types";
import type { InvoiceStatus } from "@/lib/api/types";

/**
 * Mirrors the backend CreateInvoiceSchema (amount int ≥1, dueDate coerced to
 * date — the FE sends the YYYY-MM-DD date-input value).
 */
export const CreateInvoiceSchema = z.object({
  institutionId: z.string().uuid("Pilih institusi."),
  amount: z.number().int().min(1, "Nominal minimal Rp 1."),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(2000, "Catatan maksimal 2000 karakter.").optional(),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

export const UpdateStatusSchema = z.object({
  status: z.enum(INVOICE_STATUSES),
  notes: z.string().trim().max(2000),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: "Belum Dibayar",
  PAID: "Dibayar",
  CANCELLED: "Dibatalkan",
};
