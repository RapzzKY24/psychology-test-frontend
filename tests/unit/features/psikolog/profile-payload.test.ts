import { describe, expect, it } from "vitest";
import { ProfileSchema } from "@/features/psikolog/profil/schemas";

describe("ProfileSchema", () => {
  it("accepts a valid payload", () => {
    expect(
      ProfileSchema.safeParse({
        fullName: "Dr. Sinta",
        degree: "M.Psi., Psikolog",
        licenseNumber: "SIPP-123",
      }).success,
    ).toBe(true);
  });

  it("rejects short fields", () => {
    expect(
      ProfileSchema.safeParse({ fullName: "Dr", degree: "M", licenseNumber: "1" })
        .success,
    ).toBe(false);
  });
});
