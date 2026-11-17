import { describe, expect, it } from "vitest";
import { VerificationCodeSchema } from "@/features/public/schemas";

describe("VerificationCodeSchema", () => {
  it("accepts a code printed under the QR", () => {
    expect(VerificationCodeSchema.safeParse({ code: "AB12CD34EF" }).success).toBe(true);
    expect(VerificationCodeSchema.safeParse({ code: "abc-123" }).success).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const parsed = VerificationCodeSchema.safeParse({ code: "  AB12CD34EF  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.code).toBe("AB12CD34EF");
  });

  it("rejects an empty, too short, or malformed code", () => {
    expect(VerificationCodeSchema.safeParse({ code: "" }).success).toBe(false);
    expect(VerificationCodeSchema.safeParse({ code: "AB" }).success).toBe(false);
    expect(VerificationCodeSchema.safeParse({ code: "AB 12 CD" }).success).toBe(false);
    expect(VerificationCodeSchema.safeParse({ code: "AB@12CD" }).success).toBe(false);
  });
});
