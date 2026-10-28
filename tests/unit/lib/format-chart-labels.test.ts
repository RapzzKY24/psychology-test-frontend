import { describe, expect, it } from "vitest";
import { formatMonthShort } from "@/lib/format/format-month-short";
import { formatDayShort } from "@/lib/format/format-day-short";

describe("formatMonthShort", () => {
  it("renders a month key as an Indonesian short label", () => {
    expect(formatMonthShort("2026-10")).toBe("Okt 26");
  });

  it("returns the input untouched when it is not a month key", () => {
    expect(formatMonthShort("2026")).toBe("2026");
  });
});

describe("formatDayShort", () => {
  it("renders a day key as an Indonesian short label", () => {
    expect(formatDayShort("2026-10-28")).toBe("28 Okt");
  });

  it("returns the input untouched when it is not a day key", () => {
    expect(formatDayShort("2026-10")).toBe("2026-10");
  });
});
