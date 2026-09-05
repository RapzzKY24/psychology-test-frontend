import type { UserRole } from "@/lib/api/types";

/** Landing route per role — re-exported here for form hooks' convenience. */
export { ROLE_HOME, resolveSafeNext, roleHome } from "./redirect";

/** After sign-up the role is always server-assigned PARTICIPANT. */
export const SIGNUP_FALLBACK_HOME = "/dashboard";

/**
 * Better Auth error codes are UPPER_SNAKE and do NOT pass through the Nest
 * error filter — they must never hit errorMessageFor()'s status fallback
 * (a wrong-password 401 must not read "Sesi berakhir").
 */
export const BETTER_AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Email atau kata sandi salah.",
  USER_ALREADY_EXISTS: "Email sudah terdaftar — silakan masuk.",
  USER_NOT_FOUND: "Akun tidak ditemukan.",
  INVALID_EMAIL: "Format email tidak valid.",
  PASSWORD_TOO_SHORT: "Kata sandi minimal 8 karakter.",
  USER_BANNED: "Akun Anda diblokir — hubungi admin.",
  // Exact string re-verified against a live 429 during the smoke checklist.
  RATE_LIMITED: "Terlalu banyak percobaan — tunggu sebentar.",
};

export interface BetterAuthErrorLike {
  code?: string;
}

const GENERIC_AUTH_ERROR = "Terjadi kesalahan — coba lagi.";

export function betterAuthErrorMessage(error?: BetterAuthErrorLike | null): string {
  if (!error?.code) return GENERIC_AUTH_ERROR;
  return BETTER_AUTH_ERROR_MESSAGES[error.code] ?? GENERIC_AUTH_ERROR;
}

export type { UserRole };
