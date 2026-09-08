import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const SignUpSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi.").max(100),
    email: z.email("Format email tidak valid."),
    // Mirrors the Better Auth default minimum on the backend.
    password: z.string().min(8, "Kata sandi minimal 8 karakter."),
    confirmPassword: z.string().min(8, "Kata sandi minimal 8 karakter."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;

export const InstansiSignUpSchema = z
  .object({
    companyName: z.string().trim().min(2, "Nama perusahaan minimal 2 karakter.").max(200),
    picName: z.string().trim().min(2, "Nama PIC minimal 2 karakter.").max(100),
    email: z.email("Format email tidak valid."),
    phone: z.string().trim().min(5, "Nomor HP minimal 5 karakter.").max(20),
    address: z.string().trim().min(5, "Alamat minimal 5 karakter.").max(500),
    password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(100),
    confirmPassword: z.string().min(8, "Kata sandi minimal 8 karakter."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type InstansiSignUpInput = z.infer<typeof InstansiSignUpSchema>;
