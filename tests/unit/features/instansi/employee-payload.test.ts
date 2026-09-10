import { describe, expect, it } from "vitest";
import { toCreatePayload, toUpdatePayload } from "@/features/instansi/employees/payload";

const values = {
  name: "Budi Santoso",
  destinationCountry: "Jepang",
  idType: "NIK",
  idNumber: "3201234567890001",
  birthDate: "2000-01-15",
  phone: "",
  notes: "",
} as const;

describe("toCreatePayload", () => {
  it("converts date-only birthDate to ISO datetime", () => {
    const payload = toCreatePayload({ ...values });
    expect(payload.birthDate).toBe(new Date("2000-01-15T00:00:00").toISOString());
    expect(payload.idNumber).toBe("3201234567890001");
  });

  it("drops blank optionals", () => {
    const payload = toCreatePayload({ ...values, birthDate: "", phone: "", notes: "" });
    expect(payload.birthDate).toBeUndefined();
    expect(payload.phone).toBeUndefined();
    expect(payload.notes).toBeUndefined();
  });
});

describe("toUpdatePayload", () => {
  it("strips idNumber (BE update schema omits it)", () => {
    const payload = toUpdatePayload({ ...values });
    expect(payload).not.toHaveProperty("idNumber");
    expect(payload.name).toBe("Budi Santoso");
  });
});
