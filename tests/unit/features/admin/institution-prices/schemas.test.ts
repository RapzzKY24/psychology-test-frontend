import { describe, expect, it } from "vitest";
import {
  buildDealPriceDraft,
  toDealPricePayload,
} from "@/features/admin/institution-prices/schemas";

describe("buildDealPriceDraft", () => {
  it("seeds each row from its deal price, blank when there is none", () => {
    expect(
      buildDealPriceDraft([
        { testId: "t1", dealPrice: 100_000 },
        { testId: "t2", dealPrice: null },
      ]),
    ).toEqual({ t1: "100000", t2: "" });
  });
});

describe("toDealPricePayload", () => {
  it("ignores blank inputs so the test keeps its website price", () => {
    expect(toDealPricePayload({ t1: "", t2: "   " })).toEqual({
      prices: [],
      invalidTestIds: [],
    });
  });

  it("converts filled inputs to integer prices", () => {
    expect(toDealPricePayload({ t1: "100000", t2: "250000" })).toEqual({
      prices: [
        { testId: "t1", price: 100_000 },
        { testId: "t2", price: 250_000 },
      ],
      invalidTestIds: [],
    });
  });

  it("rejects zero, negatives, fractions and non-numbers", () => {
    expect(
      toDealPricePayload({
        a: "0",
        b: "-5",
        c: "1.5",
        d: "abc",
        e: "100000",
      }),
    ).toEqual({
      prices: [{ testId: "e", price: 100_000 }],
      invalidTestIds: ["a", "b", "c", "d"],
    });
  });
});
