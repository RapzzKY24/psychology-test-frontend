import { describe, expect, it } from "vitest";
import { SignInSchema, SignUpSchema } from "@/features/auth/schemas";

describe("SignInSchema", () => {
  it("accepts valid credentials", () => {
    const parsed = SignInSchema.safeParse({ email: "budi@example.com", password: "rahasia" });
    expect(parsed.success).toBe(true);
  });

  it("rejects a malformed email and an empty password", () => {
    expect(SignInSchema.safeParse({ email: "budi", password: "x" }).success).toBe(false);
    expect(SignInSchema.safeParse({ email: "budi@example.com", password: "" }).success).toBe(false);
  });
});

describe("SignUpSchema", () => {
  const base = {
    name: "Budi",
    email: "budi@example.com",
    password: "rahasia123",
    confirmPassword: "rahasia123",
  };

  it("accepts a valid sign-up", () => {
    expect(SignUpSchema.safeParse(base).success).toBe(true);
  });

  it("requires the name", () => {
    expect(SignUpSchema.safeParse({ ...base, name: "  " }).success).toBe(false);
  });

  it("enforces the 8-character minimum", () => {
    expect(
      SignUpSchema.safeParse({ ...base, password: "short7", confirmPassword: "short7" }).success,
    ).toBe(false);
  });

  it("rejects a confirmation mismatch on the confirmPassword path", () => {
    const parsed = SignUpSchema.safeParse({ ...base, confirmPassword: "lain" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toContain("confirmPassword");
    }
  });
});
