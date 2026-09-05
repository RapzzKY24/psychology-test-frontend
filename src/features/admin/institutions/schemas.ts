import { z } from "zod";

/** Mirrors the backend CreateInstitutionSchema (name/contact 1–200, notes ≤2000). */
export const InstitutionSchema = z.object({
  name: z.string().trim().min(1, "Nama institusi wajib diisi.").max(200),
  contactName: z.string().trim().min(1, "Nama kontak wajib diisi.").max(200),
  contactEmail: z.email("Format email tidak valid."),
  phone: z
    .string()
    .trim()
    .max(50, "Nomor telepon terlalu panjang.")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(2000, "Catatan maksimal 2000 karakter.").optional().or(z.literal("")),
});

export type InstitutionInput = z.infer<typeof InstitutionSchema>;
