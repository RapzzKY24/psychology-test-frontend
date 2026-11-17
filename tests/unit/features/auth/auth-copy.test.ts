import { describe, expect, it } from "vitest";
import { AUTH_COPY } from "@/features/auth/copy";

/** The tone rules in copy.ts, enforced instead of left to review. */
const FORBIDDEN = ["beli", "promo", "diskon", "buruan", "jangan lewatkan"];

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(strings);
  }
  return [];
}

describe("AUTH_COPY", () => {
  it("never sounds like a store", () => {
    const all = strings(AUTH_COPY).join(" ").toLowerCase();
    for (const word of FORBIDDEN) {
      expect(all).not.toContain(word);
    }
  });

  it("names the platform in the returning-visitor question", () => {
    expect(AUTH_COPY.gateway.status.question).toContain("mypsikolog.id");
  });

  it("warns that the name reaches the certificate", () => {
    expect(AUTH_COPY.fields.name.hint.toLowerCase()).toContain("sertifikat");
  });
});
