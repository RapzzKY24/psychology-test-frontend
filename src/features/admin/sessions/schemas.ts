import { z } from "zod";

/**
 * Mirrors the backend CreateSessionSchema (strict): testIds unique uuids,
 * slotLimit 1–1000, expiresAt must be future, optional PIN 4–8 chars.
 * expiresAt arrives as a datetime-local string and is sent as ISO.
 */
export const CreateSessionSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200),
  institutionId: z.string().uuid().optional().or(z.literal("")),
  testIds: z.array(z.string().uuid()).min(1, "Pilih minimal satu tes."),
  slotLimit: z.number().int().min(1, "Slot minimal 1.").max(1000, "Slot maksimal 1000."),
  expiresAt: z
    .string()
    .min(1, "Waktu kedaluwarsa wajib diisi.")
    .refine((v) => new Date(v).getTime() > Date.now(), "Waktu kedaluwarsa harus di masa depan."),
  pin: z
    .string()
    .regex(/^[0-9]*$/, "PIN hanya angka.")
    .min(4, "PIN 4–8 angka.")
    .max(8, "PIN 4–8 angka.")
    .optional()
    .or(z.literal("")),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

export const SESSION_STATUS_LABEL = {
  ACTIVE: "Aktif",
  CLOSED: "Ditutup",
} as const;
