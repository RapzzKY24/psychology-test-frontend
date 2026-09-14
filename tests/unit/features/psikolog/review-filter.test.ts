import { describe, expect, it } from "vitest";
import { ReviewFilterSchema } from "@/features/psikolog/review/schemas";

describe("ReviewFilterSchema", () => {
  it("accepts APPROVED status", () => {
    expect(
      ReviewFilterSchema.safeParse({ status: "APPROVED", page: 1, limit: 10 }).success,
    ).toBe(true);
  });

  it("accepts PENDING_REVIEW and RETURNED", () => {
    expect(
      ReviewFilterSchema.safeParse({ status: "PENDING_REVIEW", page: 1 }).success,
    ).toBe(true);
    expect(
      ReviewFilterSchema.safeParse({ status: "RETURNED", page: 1 }).success,
    ).toBe(true);
  });

  it("rejects unknown status", () => {
    expect(
      ReviewFilterSchema.safeParse({ status: "FOO", page: 1 } as unknown as Record<string, unknown>)
        .success,
    ).toBe(false);
  });

  it("defaults page and limit", () => {
    const parsed = ReviewFilterSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.limit).toBe(10);
    }
  });
});
