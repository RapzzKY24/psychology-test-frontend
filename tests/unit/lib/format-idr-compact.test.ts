import { describe, expect, it } from "vitest";
import { formatIdrCompact } from "@/lib/format/format-idr-compact";

describe("formatIdrCompact", () => {
  it("compacts millions into the Indonesian short form", () => {
    expect(formatIdrCompact(1_500_000)).toBe("Rp1,5 jt");
  });

  it("keeps small amounts readable", () => {
    expect(formatIdrCompact(0)).toBe("Rp0");
    expect(formatIdrCompact(250_000)).toBe("Rp250 rb");
  });
});
