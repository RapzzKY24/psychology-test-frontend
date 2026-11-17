import { describe, expect, it } from "vitest";
import { PUBLIC_COPY } from "@/features/public/copy";
import { FAQ_ITEMS, HELP_FLOWS } from "@/features/public/help-content";

const FORBIDDEN = [
  "terlulusi",
  "dijamin",
  "100%",
  "buruan",
  "promo",
  "diskon",
  "penawaran terbatas",
];

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const ALL_COPY = [...strings(PUBLIC_COPY), ...strings(FAQ_ITEMS), ...strings(HELP_FLOWS)]
  .join(" ")
  .toLowerCase();

describe("public copy", () => {
  it("never promises a diagnosis, a guarantee, or a sale", () => {
    for (const word of FORBIDDEN) {
      expect(ALL_COPY).not.toContain(word);
    }
  });

  it("calls the result verified, not a report, on the test page", () => {
    expect(PUBLIC_COPY.testDetail.facts.resultValue).toBe("Diverifikasi psikolog");
    expect(PUBLIC_COPY.testDetail.facts.resultValue).not.toContain("Laporan");
  });

  it("keeps the landing promise about a readable result", () => {
    expect(PUBLIC_COPY.landing.hero.title).toContain("Kenali diri");
    expect(PUBLIC_COPY.landing.hero.description).toContain("psikolog");
  });

  it("names verification explicitly", () => {
    expect(PUBLIC_COPY.verification.indexTitle).toContain("Verifikasi");
    expect(PUBLIC_COPY.verification.indexDescription).toContain("tidak menampilkan skor");
  });
});
