import { z } from "zod";

/** Mirrors backend ReturnReviewSchema (reason 10–2000). */
export const ReturnReviewSchema = z.object({
  reason: z.string().trim().min(10, "Alasan minimal 10 karakter.").max(2000),
});

export type ReturnReviewInput = z.infer<typeof ReturnReviewSchema>;

/** Mirrors backend UpdateNotesSchema. */
export const ReviewNotesSchema = z.object({
  notes: z.string().trim().min(1, "Catatan wajib diisi.").max(5000),
});

export type ReviewNotesInput = z.infer<typeof ReviewNotesSchema>;

/** Mirrors backend CorrectionSchema (scores object + pattern + reason). */
export const CorrectionSchema = z.object({
  patternCode: z.string().trim().min(1, "Kode pola wajib diisi."),
  reason: z.string().trim().min(10, "Alasan minimal 10 karakter.").max(2000),
});

export type CorrectionInput = z.infer<typeof CorrectionSchema>;

export const ReviewFilterSchema = z.object({
  status: z.enum(["PENDING_REVIEW", "RETURNED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ReviewFilterInput = z.infer<typeof ReviewFilterSchema>;
