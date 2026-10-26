import { z } from "zod";
import { MAX_SLOT_LIMIT } from "./constants";

/**
 * Checkout form for a prepaid batch: pick at least one test and how many
 * slots to buy. Title and expiry are filled by the backend, never by the
 * institution (owner decision #9).
 */
export const CreateBatchSchema = z.object({
  testIds: z.array(z.string()).min(1, "Pilih minimal satu tes."),
  slotLimit: z
    .number({
      // An empty number input reaches the form as NaN — say "required", not
      // "must be a number".
      error: (issue) =>
        typeof issue.input === "number" && Number.isNaN(issue.input)
          ? "Jumlah peserta wajib diisi."
          : "Jumlah peserta harus berupa angka.",
    })
    .int("Jumlah peserta harus bilangan bulat.")
    .min(1, "Jumlah peserta minimal 1.")
    .max(MAX_SLOT_LIMIT, `Jumlah peserta maksimal ${MAX_SLOT_LIMIT}.`),
});

export type CreateBatchInput = z.infer<typeof CreateBatchSchema>;
