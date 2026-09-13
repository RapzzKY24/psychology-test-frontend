import { z } from "zod";
import { splitDisplayName } from "./utils/split-display-name";

/**
 * Mirrors backend UpdateProfileSchema. The form shows a single display name
 * ("Nama, Gelar") which is split on the last comma before submit.
 * NIK/institusi are editable by the owner.
 */
export const ProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .max(202, "Nama terlalu panjang (maks 202 karakter).")
    .refine((v) => splitDisplayName(v).fullName.length >= 3, {
      message: "Nama sebelum koma minimal 3 karakter.",
    })
    .refine((v) => splitDisplayName(v).fullName.length <= 100, {
      message: "Nama terlalu panjang (maks 100 karakter).",
    })
    .refine((v) => !v.includes(",") || splitDisplayName(v).degree.length > 0, {
      message: "Tulis gelar setelah koma, cth. Dr. Ayu Lestari, M.Psi., Psikolog.",
    })
    .refine(
      (v) => {
        const { degree } = splitDisplayName(v);
        return degree.length === 0 || degree.length >= 2;
      },
      { message: "Gelar minimal 2 karakter." },
    )
    .refine((v) => splitDisplayName(v).degree.length <= 100, {
      message: "Gelar terlalu panjang (maks 100 karakter).",
    }),
  licenseNumber: z.string().trim().min(3, "Nomor lisensi minimal 3 karakter.").max(50),
  nik: z.string().trim().regex(/^\d{16}$/, "NIK harus 16 digit angka."),
  institutionName: z.string().trim().min(2, "Asal instansi minimal 2 karakter.").max(200),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

/** Wire payload for PUT /psychologist/me/profile. */
export interface ProfilePayload {
  fullName: string;
  degree: string;
  licenseNumber: string;
  nik: string;
  institutionName: string;
}

export function toProfilePayload(values: ProfileInput): ProfilePayload {
  const { fullName, degree } = splitDisplayName(values.displayName);
  return {
    fullName,
    degree,
    licenseNumber: values.licenseNumber,
    nik: values.nik,
    institutionName: values.institutionName,
  };
}
