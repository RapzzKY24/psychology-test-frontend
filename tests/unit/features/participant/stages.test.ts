import { describe, expect, it } from "vitest";
import { stageOf } from "@/features/participant/stages";

describe("stageOf", () => {
  it("names an unfinished attempt as dikerjakan", () => {
    expect(stageOf({ status: "IN_PROGRESS", resultStatus: null })).toBe("IN_PROGRESS");
  });

  it("names a completed attempt with a pending result as menunggu review", () => {
    expect(stageOf({ status: "COMPLETED", resultStatus: "PENDING_REVIEW" })).toBe(
      "AWAITING_REVIEW",
    );
  });

  it("keeps a completed attempt without a result in menunggu review", () => {
    expect(stageOf({ status: "COMPLETED", resultStatus: null })).toBe("AWAITING_REVIEW");
  });

  it("names an approved result as hasil terbit", () => {
    expect(stageOf({ status: "COMPLETED", resultStatus: "APPROVED" })).toBe("APPROVED");
  });

  it("names a returned result as dikembalikan", () => {
    expect(stageOf({ status: "COMPLETED", resultStatus: "RETURNED" })).toBe("RETURNED");
  });

  it("has no stage for an abandoned attempt", () => {
    expect(stageOf({ status: "ABANDONED", resultStatus: null })).toBeNull();
  });
});
