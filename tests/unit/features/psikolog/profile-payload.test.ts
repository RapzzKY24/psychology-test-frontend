import { describe, expect, it } from "vitest";
import { ProfileSchema, toProfilePayload } from "@/features/psikolog/profil/schemas";

const valid = {
  displayName: "Dr. Ayu Lestari, M.Psi., Psikolog",
  licenseNumber: "SIPP-123",
  nik: "3201010101010001",
  institutionName: "RS Harapan",
};

describe("ProfileSchema", () => {
  it("accepts a valid payload", () => {
    expect(ProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a name without a degree part", () => {
    expect(
      ProfileSchema.safeParse({ ...valid, displayName: "Budi Santoso" }).success,
    ).toBe(true);
  });

  it("rejects short fields", () => {
    expect(
      ProfileSchema.safeParse({
        displayName: "Dr",
        licenseNumber: "1",
        nik: "123",
        institutionName: "R",
      }).success,
    ).toBe(false);
  });

  it("rejects a trailing comma without a degree", () => {
    const parsed = ProfileSchema.safeParse({ ...valid, displayName: "Ayu, " });
    expect(parsed.success).toBe(false);
  });

  it("rejects a one-character degree", () => {
    expect(
      ProfileSchema.safeParse({ ...valid, displayName: "Ayu, P" }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric NIK", () => {
    expect(
      ProfileSchema.safeParse({ ...valid, nik: "abcdefghijklmnop" }).success,
    ).toBe(false);
  });
});

describe("toProfilePayload", () => {
  it("splits the display name on the last comma", () => {
    expect(toProfilePayload(valid)).toEqual({
      fullName: "Dr. Ayu Lestari, M.Psi.",
      degree: "Psikolog",
      licenseNumber: "SIPP-123",
      nik: "3201010101010001",
      institutionName: "RS Harapan",
    });
  });

  it("sends an empty degree when there is no comma", () => {
    expect(
      toProfilePayload({ ...valid, displayName: "Budi Santoso" }).degree,
    ).toBe("");
  });
});
