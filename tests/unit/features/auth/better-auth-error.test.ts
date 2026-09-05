import { describe, expect, it } from "vitest";
import { BETTER_AUTH_ERROR_MESSAGES, betterAuthErrorMessage } from "@/features/auth/constants";

describe("betterAuthErrorMessage", () => {
  it("maps every catalog entry to non-empty Indonesian copy", () => {
    for (const [code, message] of Object.entries(BETTER_AUTH_ERROR_MESSAGES)) {
      expect(betterAuthErrorMessage({ code }), `code ${code}`).toBe(message);
      expect(message.length).toBeGreaterThan(0);
    }
  });

  it("maps known auth failures", () => {
    expect(betterAuthErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" })).toBe(
      "Email atau kata sandi salah.",
    );
    expect(betterAuthErrorMessage({ code: "USER_ALREADY_EXISTS" })).toBe(
      "Email sudah terdaftar — silakan masuk.",
    );
    expect(betterAuthErrorMessage({ code: "USER_BANNED" })).toBe(
      "Akun Anda diblokir — hubungi admin.",
    );
  });

  it("never leaks raw messages and never uses status fallbacks", () => {
    expect(betterAuthErrorMessage({ code: "SOMETHING_NEW" })).toBe("Terjadi kesalahan — coba lagi.");
    expect(betterAuthErrorMessage(undefined)).toBe("Terjadi kesalahan — coba lagi.");
    expect(betterAuthErrorMessage(null)).toBe("Terjadi kesalahan — coba lagi.");
    expect(betterAuthErrorMessage({})).toBe("Terjadi kesalahan — coba lagi.");
  });
});
