import { z } from "zod";

/** Mirrors backend CreateInstansiSessionSchema (unique ids, future expiry). */
export const CreateInstansiSessionSchema = z
  .object({
    title: z.string().trim().min(1, "Judul sesi wajib diisi.").max(200),
    testIds: z
      .array(z.string().uuid("Tes tidak valid."))
      .min(1, "Pilih minimal 1 tes.")
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Tes tidak boleh duplikat.",
      }),
    employeeIds: z
      .array(z.string().uuid("Pegawai tidak valid."))
      .min(1, "Pilih minimal 1 pegawai.")
      .max(1000)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Pegawai tidak boleh duplikat.",
      }),
    slotLimit: z.number().int().min(1, "Slot minimal 1.").max(1000, "Slot maksimal 1000."),
    expiresAt: z.string().min(1, "Tanggal kedaluwarsa wajib diisi."),
    pin: z.string().trim().min(4, "PIN minimal 4 karakter.").max(8, "PIN maksimal 8 karakter.").optional().or(z.literal("")),
  })
  .strict()
  .refine((v) => v.employeeIds.length <= v.slotLimit, {
    message: "Jumlah pegawai melebihi slot.",
    path: ["slotLimit"],
  })
  .refine((v) => new Date(v.expiresAt).getTime() > Date.now(), {
    message: "Tanggal kedaluwarsa harus di masa depan.",
    path: ["expiresAt"],
  });

export type CreateInstansiSessionInput = z.infer<typeof CreateInstansiSessionSchema>;
