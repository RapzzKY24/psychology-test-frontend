import { z } from "zod";
import { USER_ROLES } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/types";

/** Mirrors the backend CreateUserSchema (name 2–100, password 8–100). */
export const CreateUserSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100),
  email: z.email("Format email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter.").max(100),
  role: z.enum(USER_ROLES),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  PSYCHOLOGIST: "Psikolog",
  PARTICIPANT: "Peserta",
};
