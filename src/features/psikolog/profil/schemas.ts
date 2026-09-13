import { z } from "zod";

/** Mirrors backend UpdateProfileSchema. NIK/institusi read-only (admin-owned). */
export const ProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter.").max(100),
  degree: z.string().trim().min(2, "Gelar minimal 2 karakter.").max(100),
  licenseNumber: z.string().trim().min(3, "Nomor lisensi minimal 3 karakter.").max(50),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
