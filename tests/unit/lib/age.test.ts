import { describe, expect, it } from "vitest";
import {
  ageInMonths,
  checkAgeBand,
  formatAge,
  formatAgeBand,
  parseIsoDate,
  type AgeBand,
} from "@/lib/age";

const CFIT2: AgeBand = { minMonths: 168, maxMonths: 179 };

describe("parseIsoDate", () => {
  it("reads the input value as a local calendar date", () => {
    const date = parseIsoDate("2012-03-09");
    expect(date && [date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2012, 2, 9]);
  });

  it("rejects impossible dates and free text", () => {
    expect(parseIsoDate("2012-02-30")).toBeNull();
    expect(parseIsoDate("09-03-2012")).toBeNull();
    expect(parseIsoDate("")).toBeNull();
  });
});

describe("ageInMonths", () => {
  it("counts completed months, not calendar months", () => {
    const birth = new Date(2012, 2, 9); // 9 March 2012
    expect(ageInMonths(birth, new Date(2026, 2, 9))).toBe(168);
    expect(ageInMonths(birth, new Date(2026, 2, 8))).toBe(167);
    expect(ageInMonths(birth, new Date(2026, 3, 9))).toBe(169);
  });

  it("handles the day-of-month rollover at month ends", () => {
    const birth = new Date(2012, 0, 31); // 31 January 2012
    expect(ageInMonths(birth, new Date(2026, 1, 28))).toBe(168);
    expect(ageInMonths(birth, new Date(2026, 2, 1))).toBe(169);
  });
});

describe("checkAgeBand", () => {
  it("keeps both edges inside the band", () => {
    expect(checkAgeBand(167, CFIT2)).toBe("below");
    expect(checkAgeBand(168, CFIT2)).toBe("inside");
    expect(checkAgeBand(179, CFIT2)).toBe("inside");
    expect(checkAgeBand(180, CFIT2)).toBe("above");
  });
});

describe("formatAge", () => {
  it("drops a zero month part once there is at least a year", () => {
    expect(formatAge(0)).toBe("0 bulan");
    expect(formatAge(11)).toBe("11 bulan");
    expect(formatAge(12)).toBe("1 tahun");
    expect(formatAge(27)).toBe("2 tahun 3 bulan");
  });
});

describe("formatAgeBand", () => {
  it("keeps the zero month so the range reads as 14y0m–14y11m", () => {
    expect(formatAgeBand(CFIT2)).toBe("14 tahun 0 bulan – 14 tahun 11 bulan");
  });
});
