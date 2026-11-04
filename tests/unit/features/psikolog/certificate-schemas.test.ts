import { describe, expect, it } from "vitest";
import type { CertificateFormData } from "@/lib/api/types";
import {
  buildCertificatePayload,
  fieldLabel,
  missingFieldsOf,
  remainingLabel,
  toCertificateValues,
} from "@/features/psikolog/certificates/schemas";

function form(overrides: Partial<CertificateFormData["certificate"]> = {}): CertificateFormData {
  return {
    certificate: {
      id: "c1",
      resultId: "r1",
      status: "DRAFT",
      identity: {
        fullName: "Budi Santoso",
        idNumber: "",
        gender: "",
        birthPlace: "",
        birthDate: "",
        age: 0,
        address: "",
      },
      verdict: null,
      purpose: null,
      validUntil: null,
      photoPath: null,
      filledById: "psy-1",
      number: null,
      seq: null,
      year: null,
      revision: null,
      supersedesId: null,
      verifyCode: null,
      issuedAt: null,
      revokedAt: null,
      revokeReason: null,
      updatedAt: "2026-11-03T00:00:00.000Z",
      ...overrides,
    },
    result: {
      resultId: "r1",
      testName: "Kraepelin",
      testSlug: "kraepelin",
      participantName: "Budi",
      sessionTitle: "Batch 1",
    },
    readiness: { profileComplete: true, missingFields: [] },
  };
}

describe("toCertificateValues", () => {
  it("turns stored timestamps into the calendar days the inputs expect", () => {
    const values = toCertificateValues(
      form({
        identity: {
          fullName: "Budi",
          idNumber: "3201",
          gender: "LAKI_LAKI",
          birthPlace: "Bogor",
          birthDate: "1996-01-01",
          age: 30,
          address: "Jl. Merdeka 1",
        },
        validUntil: "2027-12-31T00:00:00.000+07:00",
      }),
    );

    expect(values.birthDate).toBe("1996-01-01");
    expect(values.validUntil).toBe("2027-12-31");
    expect(values.age).toBe("30");
    expect(values.verdict).toBe("");
  });

  it("keeps an empty age empty instead of printing 0", () => {
    const values = toCertificateValues(form());

    expect(values.age).toBe("");
  });
});

describe("buildCertificatePayload", () => {
  it("omits untouched fields instead of sending empty strings", () => {
    const payload = buildCertificatePayload(toCertificateValues(form()));

    expect(payload.identity).toEqual({ fullName: "Budi Santoso" });
    expect(payload.verdict).toBeUndefined();
    expect(payload.purpose).toBeUndefined();
    expect(payload.validUntil).toBeUndefined();
  });

  it("sends the verdict, purpose and validity once chosen", () => {
    const values = toCertificateValues(form());
    values.verdict = "MEMENUHI_SYARAT";
    values.purpose = "  CPMI  ";
    values.validUntil = "2027-12-31";

    expect(buildCertificatePayload(values)).toEqual({
      identity: { fullName: "Budi Santoso" },
      verdict: "MEMENUHI_SYARAT",
      purpose: "CPMI",
      validUntil: "2027-12-31",
    });
  });

  it("converts the typed age to a number and drops a non-numeric one", () => {
    const values = toCertificateValues(form());
    values.age = "31";
    expect(buildCertificatePayload(values).identity?.age).toBe(31);

    values.age = "abc";
    expect(buildCertificatePayload(values).identity?.age).toBeUndefined();
  });
});

describe("missingFieldsOf", () => {
  it("lists what still blocks publishing, including the photo", () => {
    const missing = missingFieldsOf(toCertificateValues(form()), null);

    expect(missing).toEqual(
      expect.arrayContaining(["verdict", "purpose", "validUntil", "photo"]),
    );
    expect(missing).toContain("identity.idNumber");
  });

  it("reports nothing once every field and the photo are present", () => {
    const values = toCertificateValues(
      form({
        identity: {
          fullName: "Budi",
          idNumber: "3201",
          gender: "LAKI_LAKI",
          birthPlace: "Bogor",
          birthDate: "1996-01-01",
          age: 30,
          address: "Jl. Merdeka 1",
        },
        verdict: "MEMENUHI_SYARAT",
        purpose: "CPMI",
        validUntil: "2027-12-31T00:00:00.000+07:00",
        photoPath: "uploads/certificates/p.png",
      }),
    );

    expect(missingFieldsOf(values, "uploads/certificates/p.png")).toEqual([]);
  });
});

describe("labels", () => {
  it("translates backend field keys and falls back to the key", () => {
    expect(fieldLabel("identity.birthDate")).toBe("Tanggal lahir");
    expect(fieldLabel("photo")).toBe("Foto 3×4");
    expect(fieldLabel("something.new")).toBe("something.new");
  });

  it("counts in Indonesian", () => {
    expect(remainingLabel(1)).toBe("1 kolom belum diisi");
    expect(remainingLabel(3)).toBe("3 kolom belum diisi");
  });
});
