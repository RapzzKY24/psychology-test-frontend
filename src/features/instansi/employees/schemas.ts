import { z } from "zod";
import { ID_TYPES } from "@/lib/api/types";

/** Mirrors backend CreateInstansiParticipantSchema (name min 2 words). */
export const EmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama pegawai wajib diisi.")
    .max(200)
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, {
      message: "Nama minimal 2 kata.",
    }),
  destinationCountry: z.string().trim().min(1, "Negara tujuan wajib diisi.").max(100),
  idType: z.enum(ID_TYPES),
  idNumber: z.string().trim().min(1, "Nomor identitas wajib diisi.").max(50),
  birthDate: z.string().trim().min(1).optional().or(z.literal("")),
  phone: z.string().trim().max(20, "Nomor telepon terlalu panjang.").optional().or(z.literal("")),
  notes: z.string().trim().max(2000, "Catatan maksimal 2000 karakter.").optional().or(z.literal("")),
});

export type EmployeeInput = z.infer<typeof EmployeeSchema>;
