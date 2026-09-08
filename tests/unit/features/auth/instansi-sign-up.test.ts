import { describe, expect, it } from "vitest";
import { InstansiSignUpSchema } from "@/features/auth/schemas";

const valid = {
  companyName: "PT Maju Jaya",
  picName: "Budi Santoso",
  email: "hr@majujaya.co.id",
  phone: "0215551234",
  address: "Jl. Sudirman No. 1 Jakarta",
  password: "rahasia123",
  confirmPassword: "rahasia123",
};

describe("InstansiSignUpSchema", () => {
  it("accepts a valid payload", () => {
    expect(InstansiSignUpSchema.safeParse(valid).success).toBe(true);
  });

  it("blocks password mismatch client-side", () => {
    const result = InstansiSignUpSchema.safeParse({
      ...valid,
      confirmPassword: "beda1234",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects a too-short company name", () => {
    const result = InstansiSignUpSchema.safeParse({
      ...valid,
      companyName: "X",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a bad email and short password", () => {
    expect(
      InstansiSignUpSchema.safeParse({ ...valid, email: "bukan-email" }).success,
    ).toBe(false);
    expect(
      InstansiSignUpSchema.safeParse({ ...valid, password: "pendek" }).success,
    ).toBe(false);
  });
});
