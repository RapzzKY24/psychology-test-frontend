import { describe, expect, it } from "vitest";
import { truncateText } from "@/lib/format/truncate-text";

describe("truncateText", () => {
  it("keeps short text untouched", () => {
    expect(truncateText("DISC Okt", 22)).toBe("DISC Okt");
  });

  it("cuts long text and appends an ellipsis", () => {
    expect(truncateText("DISC — PT Contoh — Oktober 2026", 10)).toBe("DISC — PT …");
  });

  it("does not truncate text of exactly the limit", () => {
    expect(truncateText("abcde", 5)).toBe("abcde");
  });
});
