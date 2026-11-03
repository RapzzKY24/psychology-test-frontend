import { describe, expect, it } from "vitest";
import { isRightWrongItemReady } from "@/features/admin/tests-builder/item-readiness";

describe("isRightWrongItemReady", () => {
  it("is ready when the question and every option are filled", () => {
    expect(isRightWrongItemReady({ question: "2 + 3 = ?", options: ["4", "5", "6", "7"] })).toBe(
      true,
    );
  });

  it("is not ready when only the question is filled", () => {
    expect(isRightWrongItemReady({ question: "2 + 3 = ?", options: ["", ""] })).toBe(false);
  });

  it("is not ready when an option is blank", () => {
    expect(isRightWrongItemReady({ question: "2 + 3 = ?", options: ["4", " "] })).toBe(false);
  });

  it("accepts an image-only item", () => {
    expect(
      isRightWrongItemReady({
        imageUrl: "/uploads/test-items/abc.png",
        options: ["4", "5"],
      }),
    ).toBe(true);
  });

  it("is not ready without a prompt", () => {
    expect(isRightWrongItemReady({ options: ["4", "5"] })).toBe(false);
  });

  it("is not ready without options", () => {
    expect(isRightWrongItemReady({ question: "2 + 3 = ?", options: [] })).toBe(false);
  });
});
