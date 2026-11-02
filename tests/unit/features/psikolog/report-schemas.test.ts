import { describe, expect, it } from "vitest";
import type { ReportFormData } from "@/lib/api/types";
import {
  buildReportPayload,
  fieldLabel,
  remainingLabel,
  ReportDraftSchema,
  toReportValues,
} from "@/features/psikolog/reports/schemas";
import {
  NARRATIVE_KEYS,
  NARRATIVE_MAX_LENGTH,
  RATING_KEYS,
} from "@/features/psikolog/reports/rubric";

function form(overrides: Partial<ReportFormData> = {}): ReportFormData {
  return {
    participant: { id: "p1", name: "Budi", age: 27, education: "SMA", destination: "Taiwan" },
    session: { id: "s1", title: "Psikotes" },
    tests: [{ testName: "DISC", patternCode: "I", status: "APPROVED", completedAt: null }],
    report: {
      id: "r1",
      status: "DRAFT",
      ratings: { "intellectual.logic": "B" },
      narratives: { overall: "Baik." },
      recommendation: null,
      number: null,
      issuedAt: null,
      updatedAt: "2026-11-02T00:00:00.000Z",
    },
    readiness: { testsApproved: true, profileComplete: true, missingFields: [] },
    ...overrides,
  };
}

describe("toReportValues", () => {
  it("creates every rating and narrative key so inputs stay controlled", () => {
    const values = toReportValues(form());

    expect(Object.keys(values.ratings)).toHaveLength(RATING_KEYS.length);
    expect(Object.keys(values.narratives)).toHaveLength(NARRATIVE_KEYS.length);
    expect(values.ratings["intellectual.logic"]).toBe("B");
    expect(values.ratings["learning.change"]).toBe("");
    expect(values.recommendation).toBe("");
  });

  it("survives a form without a report row", () => {
    const values = toReportValues(form({ report: null }));

    expect(Object.values(values.ratings).every((value) => value === "")).toBe(true);
  });
});

describe("buildReportPayload", () => {
  it("omits untouched fields instead of sending empty strings", () => {
    const values = toReportValues(form());
    const payload = buildReportPayload(values);

    expect(payload.ratings).toEqual({ "intellectual.logic": "B" });
    expect(payload.narratives).toEqual({ overall: "Baik." });
    expect(payload.recommendation).toBeUndefined();
  });

  it("trims narratives and drops blank ones", () => {
    const values = toReportValues(form());
    values.narratives.development = "   ";

    const payload = buildReportPayload(values);

    expect(payload.narratives).toEqual({ overall: "Baik." });
  });

  it("sends the recommendation once chosen", () => {
    const values = toReportValues(form());
    values.recommendation = "LAYAK";

    expect(buildReportPayload(values).recommendation).toBe("LAYAK");
  });

  it("produces an empty payload when nothing is filled", () => {
    expect(buildReportPayload(toReportValues(form({ report: null })))).toEqual({});
  });
});

describe("ReportDraftSchema", () => {
  it("accepts exactly 800 characters", () => {
    const result = ReportDraftSchema.safeParse({
      ratings: { "intellectual.logic": "B" },
      narratives: { overall: "x".repeat(NARRATIVE_MAX_LENGTH) },
      recommendation: "LAYAK",
    });

    expect(result.success).toBe(true);
  });

  it("rejects 801 characters", () => {
    const result = ReportDraftSchema.safeParse({
      ratings: { "intellectual.logic": "B" },
      narratives: { overall: "x".repeat(NARRATIVE_MAX_LENGTH + 1) },
      recommendation: "LAYAK",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a rating outside R/K/C/B/T", () => {
    const result = ReportDraftSchema.safeParse({
      ratings: { "intellectual.logic": "X" },
      narratives: {},
      recommendation: "LAYAK",
    });

    expect(result.success).toBe(false);
  });
});

describe("labels", () => {
  it("maps a backend field name to its printed label", () => {
    expect(fieldLabel("personality.emotion")).toBe("Stabilitas Emosi");
    expect(fieldLabel("recommendation")).toBe("Rekomendasi");
    expect(fieldLabel("unknown.key")).toBe("unknown.key");
  });

  it("counts remaining fields in Indonesian", () => {
    expect(remainingLabel(1)).toBe("1 kolom belum diisi");
    expect(remainingLabel(4)).toBe("4 kolom belum diisi");
  });
});
