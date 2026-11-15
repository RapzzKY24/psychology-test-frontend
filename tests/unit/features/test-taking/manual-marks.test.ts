import { describe, expect, it } from "vitest";
import { MANUAL_MARKS } from "@/lib/api/types";
import { isAnsweredManual, isAnsweredValue, toManualImage } from "@/features/test-taking/lib/answer-state";
import { paintStimulus } from "@/features/test-taking/lib/manual-marks";
import { MANUAL_MARK_LABELS } from "@/lib/manual-marks";

/** Records what the helper drew, so a missing mark shows up as an empty box. */
function recordingContext() {
  const calls: string[] = [];
  const record = (name: string) => () => {
    calls.push(name);
  };
  const ctx = {
    save: record("save"),
    restore: record("restore"),
    beginPath: record("beginPath"),
    moveTo: record("moveTo"),
    lineTo: record("lineTo"),
    bezierCurveTo: record("bezierCurveTo"),
    arc: record("arc"),
    stroke: record("stroke"),
    fill: record("fill"),
    fillRect: record("fillRect"),
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 0,
    lineCap: "",
    lineJoin: "",
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe("manual marks", () => {
  it("labels every printed mark", () => {
    for (const mark of MANUAL_MARKS) {
      expect(MANUAL_MARK_LABELS[mark].length).toBeGreaterThan(0);
    }
  });

  it("draws something for every mark", () => {
    for (const mark of MANUAL_MARKS) {
      const { ctx, calls } = recordingContext();
      paintStimulus(ctx, mark, 400, 400);
      // A dot and the square are filled, the rest are stroked.
      expect(calls.some((call) => ["stroke", "fill", "fillRect"].includes(call))).toBe(true);
      expect(calls.at(-1)).toBe("restore");
    }
  });

  it("keeps the marks inside the box", () => {
    // A mark drawn past the edge would be cropped on the sheet.
    const seen: number[] = [];
    const ctx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: (x: number, y: number) => seen.push(x, y),
      lineTo: (x: number, y: number) => seen.push(x, y),
      bezierCurveTo: (a: number, b: number, c: number, d: number, e: number, f: number) =>
        seen.push(a, b, c, d, e, f),
      arc: (x: number, y: number, r: number) => seen.push(x - r, y - r, x + r, y + r),
      stroke: () => {},
      fill: () => {},
      fillRect: (x: number, y: number, w: number, h: number) => seen.push(x, y, x + w, y + h),
      strokeStyle: "",
      fillStyle: "",
      lineWidth: 0,
      lineCap: "",
      lineJoin: "",
    } as unknown as CanvasRenderingContext2D;

    for (const mark of MANUAL_MARKS) {
      seen.length = 0;
      paintStimulus(ctx, mark, 400, 400);
      expect(Math.min(...seen)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...seen)).toBeLessThanOrEqual(400);
    }
  });
});

describe("manual answer state", () => {
  it("reads the stored path", () => {
    const imageUrl = "/api/v1/public/attempts/a/items/b/image";
    expect(toManualImage({ imageUrl })).toBe(imageUrl);
    expect(isAnsweredManual({ imageUrl })).toBe(true);
  });

  it("treats a missing or empty path as blank", () => {
    expect(toManualImage(undefined)).toBeNull();
    expect(toManualImage({})).toBeNull();
    expect(toManualImage({ imageUrl: "" })).toBeNull();
    expect(isAnsweredValue("MANUAL", { imageUrl: "" })).toBe(false);
  });

  it("counts a drawing as answered for the progress rail", () => {
    expect(
      isAnsweredValue("MANUAL", { imageUrl: "/api/v1/public/attempts/a/items/b/image" }),
    ).toBe(true);
  });
});
