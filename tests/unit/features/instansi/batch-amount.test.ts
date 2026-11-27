import { describe, expect, it } from "vitest";
import { computeBatchAmount } from "@/features/instansi/sessions/compute-batch-amount";
import type { InstansiTestOption } from "@/features/instansi/sessions/types";

function test(price: number, id = "t1"): InstansiTestOption {
  return {
    id,
    slug: id,
    name: `Tes ${id}`,
    description: "",
    imageUrl: null,
    category: "PERSONALITY",
    price,
    basePrice: price,
    hasDealPrice: false,
    estimatedDurationMin: 30,
    ageBand: null,
  };
}

describe("computeBatchAmount", () => {
  it("multiplies one test price by the slot count", () => {
    expect(computeBatchAmount([test(150_000)], 10)).toBe(1_500_000);
  });

  it("sums every selected test before multiplying", () => {
    expect(computeBatchAmount([test(150_000, "a"), test(200_000, "b")], 3)).toBe(1_050_000);
  });

  it("returns 0 when no test is selected", () => {
    expect(computeBatchAmount([], 10)).toBe(0);
  });

  it("returns 0 for a non-positive slot count", () => {
    expect(computeBatchAmount([test(150_000)], 0)).toBe(0);
    expect(computeBatchAmount([test(150_000)], -3)).toBe(0);
  });

  it("truncates fractional slots instead of returning a fractional amount", () => {
    expect(computeBatchAmount([test(150_000)], 2.9)).toBe(300_000);
  });
});
