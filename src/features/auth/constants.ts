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
  // Verified live 2026-09-05: better-auth 1.7 emits the long variant.
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Email sudah terdaftar — silakan masuk.",
  USER_ALREADY_EXISTS: "Email sudah terdaftar — silakan masuk.",
  USER_NOT_FOUND: "Akun tidak ditemukan.",
  INVALID_EMAIL: "Format email tidak valid.",
  PASSWORD_TOO_SHORT: "Kata sandi minimal 8 karakter.",
  USER_BANNED: "Akun Anda diblokir — hubungi admin.",
  // Exact string re-verified against a live 429 during the smoke checklist.
  RATE_LIMITED: "Terlalu banyak percobaan — tunggu sebentar.",
};

const GENERIC_AUTH_ERROR = "Terjadi kesalahan — coba lagi.";

/**
 * Accepts the raw better-auth error (BetterFetchError) — narrowed internally.
 * Verified live 2026-09-05: the rate limiter answers 429 with NO `code` field,
 * so status is checked explicitly (the only status-based mapping — a wrong-
 * password 401 must still read "Email atau kata sandi salah.", never a
 * status-derived copy).
 */
export function betterAuthErrorMessage(error?: unknown): string {
  const candidate = error as { code?: unknown; status?: unknown } | null | undefined;
  const code = candidate?.code;
  if (typeof code === "string") {
    const mapped = BETTER_AUTH_ERROR_MESSAGES[code];
    if (mapped) return mapped;
  }
  if (candidate?.status === 429) return BETTER_AUTH_ERROR_MESSAGES.RATE_LIMITED;
  return GENERIC_AUTH_ERROR;
}

export type { UserRole };
