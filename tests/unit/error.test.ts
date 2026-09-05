import { describe, expect, it } from "vitest";
import {
  ApiError,
  ERROR_MESSAGES,
  KNOWN_ERROR_CODES,
  errorMessageFor,
  parseErrorResponse,
} from "@/lib/api/error";

describe("errorMessageFor", () => {
  it("maps every known catalog code to Indonesian copy", () => {
    for (const code of KNOWN_ERROR_CODES) {
      const message = errorMessageFor(code, 400);
      expect(message, `code ${code}`).toBeTruthy();
      expect(ERROR_MESSAGES[code]).toBe(message);
    }
  });

  it("uses the catalog copy for known codes regardless of status", () => {
    expect(errorMessageFor("invalid_pin", 401)).toBe(ERROR_MESSAGES.invalid_pin);
    expect(errorMessageFor("result_not_released", 403)).toBe(
      "Hasil belum dirilis — menunggu review psikolog.",
    );
  });

  it("falls back by status for unknown codes (404s use human messages)", () => {
    expect(errorMessageFor("Test not found", 404)).toBe("Data tidak ditemukan.");
    expect(errorMessageFor("slug already exists", 409)).toBe(
      "Konflik dengan data yang sudah ada.",
    );
  });

  it("has a last-resort fallback", () => {
    expect(errorMessageFor("weird_new_code", 418)).toBe("Terjadi kesalahan — coba lagi.");
  });
});

describe("ApiError", () => {
  it("carries statusCode, code, and Indonesian message", () => {
    const error = new ApiError(409, "already_verified");
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("already_verified");
    expect(error.message).toBe("Pembayaran ini sudah diverifikasi sebelumnya.");
    expect(error.isValidation).toBe(false);
  });

  it("flags validation and auth errors", () => {
    expect(new ApiError(422, "validation_failed", ["price must be >= 0"]).isValidation).toBe(
      true,
    );
    expect(new ApiError(401, "unauthorized").isUnauthorized).toBe(true);
    expect(new ApiError(403, "forbidden").isForbidden).toBe(true);
    expect(new ApiError(403, "result_not_released").isResultNotReleased).toBe(true);
  });
});

describe("parseErrorResponse", () => {
  it("parses the standard error envelope", () => {
    const error = parseErrorResponse(422, {
      statusCode: 422,
      message: "validation_failed",
      error: "Unprocessable Entity",
      details: ["price must be >= 0"],
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("validation_failed");
    expect(error.details).toEqual(["price must be >= 0"]);
  });

  it("survives non-JSON bodies and malformed payloads", () => {
    const fromNull = parseErrorResponse(500, null);
    expect(fromNull.code).toBe("unknown_error");

    const fromString = parseErrorResponse(502, "<html>Bad Gateway</html>");
    expect(fromString.statusCode).toBe(502);

    const fromGarbage = parseErrorResponse(400, { details: "not-an-array" });
    expect(fromGarbage.details).toBeUndefined();
  });

  it("rejects non-string details arrays", () => {
    const error = parseErrorResponse(422, { message: "validation_failed", details: [1, 2] });
    expect(error.details).toBeUndefined();
  });
});
