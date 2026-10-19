import { describe, expect, it } from "vitest";
import {
  UpdateSessionFormSchema,
  buildSessionUpdatePayload,
  toDatetimeLocalValue,
} from "@/features/admin/sessions/schemas";

/** datetime-local format in LOCAL time (what the browser input yields). */
function futureLocal(offsetMs: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date(Date.now() + offsetMs);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

describe("UpdateSessionFormSchema", () => {
  it("accepts a future expiry", () => {
    const result = UpdateSessionFormSchema.safeParse({
      title: "Sesi A",
      expiresAt: futureLocal(3600_000),
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title, a past expiry and an over-long title", () => {
    expect(
      UpdateSessionFormSchema.safeParse({ title: "", expiresAt: futureLocal(3600_000) }).success,
    ).toBe(false);
    expect(
      UpdateSessionFormSchema.safeParse({ title: "Sesi A", expiresAt: futureLocal(-60_000) })
        .success,
    ).toBe(false);
    expect(
      UpdateSessionFormSchema.safeParse({
        title: "x".repeat(201),
        expiresAt: futureLocal(3600_000),
      }).success,
    ).toBe(false);
  });
});

describe("buildSessionUpdatePayload", () => {
  const initial = { title: "Sesi Lama", expiresAt: "2099-12-31T03:15:30.000Z" };
  const currentLocal = toDatetimeLocalValue(initial.expiresAt);

  it("returns null when nothing changed (expiry seconds are ignored)", () => {
    expect(
      buildSessionUpdatePayload(initial, { title: "Sesi Lama", expiresAt: currentLocal }),
    ).toBeNull();
  });

  it("sends only the title when only the title changed", () => {
    expect(
      buildSessionUpdatePayload(initial, { title: "Sesi Baru", expiresAt: currentLocal }),
    ).toEqual({ title: "Sesi Baru" });
  });

  it("trims the title before diffing", () => {
    expect(
      buildSessionUpdatePayload(initial, { title: "  Sesi Baru  ", expiresAt: currentLocal }),
    ).toEqual({ title: "Sesi Baru" });
  });

  it("sends only the expiry (ISO) when only the expiry changed", () => {
    const next = futureLocal(7 * 24 * 3600_000);
    expect(buildSessionUpdatePayload(initial, { title: "Sesi Lama", expiresAt: next })).toEqual({
      expiresAt: new Date(next).toISOString(),
    });
  });

  it("sends both when both changed", () => {
    const next = futureLocal(7 * 24 * 3600_000);
    expect(buildSessionUpdatePayload(initial, { title: "Sesi Baru", expiresAt: next })).toEqual({
      title: "Sesi Baru",
      expiresAt: new Date(next).toISOString(),
    });
  });
});
