import { z } from "zod";

/**
 * The code printed under the QR. It is a short, human-typed string, so the
 * validation only rejects what the verifier cannot use — the lookup itself
 * decides whether the code exists.
 */
export const VerificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Kode minimal 6 karakter.")
    .max(32, "Kode maksimal 32 karakter.")
    .regex(/^[A-Za-z0-9-]+$/, "Kode hanya berisi huruf, angka, dan tanda hubung."),
});

export type VerificationCodeInput = z.infer<typeof VerificationCodeSchema>;
