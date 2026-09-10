import { describe, expect, it } from "vitest";
import { EmployeeSchema } from "@/features/instansi/employees/schemas";

const valid = {
  name: "Budi Santoso",
  destinationCountry: "Jepang",
  idType: "NIK",
  idNumber: "3201234567890001",
  birthDate: "2000-01-15",
  phone: "0812",
  notes: "",
};

describe("EmployeeSchema", () => {
  it("accepts a valid payload", () => {
    expect(EmployeeSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a single-word name", () => {
    const result = EmployeeSchema.safeParse({ ...valid, name: "Budi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["name"]);
    }
  });

  it("rejects an invalid idType", () => {
    expect(
      EmployeeSchema.safeParse({ ...valid, idType: "KTP" }).success,
    ).toBe(false);
  });

  it("accepts an empty optional birthDate", () => {
    expect(
      EmployeeSchema.safeParse({ ...valid, birthDate: "" }).success,
    ).toBe(true);
  });
});
