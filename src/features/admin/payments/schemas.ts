import { z } from "zod";

/** Mirrors the backend CancelPaymentSchema (reason required, 1–500 chars). */
export const CancelPaymentSchema = z.object({
  reason: z.string().trim().min(1, "Alasan wajib diisi.").max(500, "Alasan maksimal 500 karakter."),
});

export type CancelPaymentInput = z.infer<typeof CancelPaymentSchema>;
