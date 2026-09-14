import { z } from "zod";

/** DISC answer (DiscResponseSchema on the backend): word indexes 0–3, must differ. */
export const DiscResponseSchema = z
  .object({
    most: z.number().int().min(0).max(3),
    least: z.number().int().min(0).max(3),
  })
  .refine((v) => v.most !== v.least, {
    message: "Kata Most dan Least tidak boleh sama.",
  });

export type DiscResponse = z.infer<typeof DiscResponseSchema>;

/** RIGHT_WRONG_NORM answer (RightWrongResponseSchema on the backend): option index. */
export const RightWrongResponseSchema = z.object({
  chosen: z.number().int().min(0).max(5),
});

export type RightWrongResponse = z.infer<typeof RightWrongResponseSchema>;
