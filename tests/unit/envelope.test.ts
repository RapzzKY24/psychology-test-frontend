import { describe, expect, it } from "vitest";
import { unwrapEnvelope } from "@/lib/api/error";

describe("unwrapEnvelope", () => {
  it("unwraps a single-resource envelope", () => {
    const result = unwrapEnvelope<{ id: string }>({
      data: { id: "abc" },
      message: "Test retrieved successfully",
    });
    expect(result.data).toEqual({ id: "abc" });
    expect(result.message).toBe("Test retrieved successfully");
    expect(result.meta).toBeUndefined();
  });

  it("unwraps a paginated envelope with full meta", () => {
    const result = unwrapEnvelope<string[]>({
      data: ["a", "b"],
      meta: { page: 1, limit: 10, total: 42, totalPages: 5 },
    });
    expect(result.data).toEqual(["a", "b"]);
    expect(result.meta).toEqual({ page: 1, limit: 10, total: 42, totalPages: 5 });
  });

  it("drops incomplete meta instead of guessing", () => {
    const result = unwrapEnvelope<unknown[]>({ data: [], meta: { page: 1 } });
    expect(result.meta).toBeUndefined();
  });

  it("passes through non-enveloped 2xx bodies defensively", () => {
    expect(unwrapEnvelope({ hello: true }).data).toEqual({ hello: true });
    expect(unwrapEnvelope(null).data).toBeNull();
  });
});
