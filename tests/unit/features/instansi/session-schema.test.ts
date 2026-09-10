import { describe, expect, it } from "vitest";
import { CreateInstansiSessionSchema } from "@/features/instansi/sessions/schemas";

const TEST_ID = "00000000-0000-4000-8000-000000000001";
const EMP_1 = "00000000-0000-4000-8000-000000000011";
const EMP_2 = "00000000-0000-4000-8000-000000000012";

/** datetime-local format in LOCAL time (what the browser input yields). */
function localInput(offsetMs: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date(Date.now() + offsetMs);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const valid = {
  title: "Sesi Rekrutmen 1",
  testIds: [TEST_ID],
  employeeIds: [EMP_1, EMP_2],
  slotLimit: 10,
  expiresAt: localInput(3600_000),
  pin: "",
};

describe("CreateInstansiSessionSchema", () => {
  it("accepts a valid payload", () => {
    expect(CreateInstansiSessionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects duplicate employeeIds", () => {
    const result = CreateInstansiSessionSchema.safeParse({
      ...valid,
      employeeIds: [EMP_1, EMP_1],
    });
    expect(result.success).toBe(false);
  });

  it("rejects employees exceeding slotLimit", () => {
    const result = CreateInstansiSessionSchema.safeParse({ ...valid, slotLimit: 1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["slotLimit"]);
    }
  });

  it("rejects a short PIN like the backend (min 4)", () => {
    expect(
      CreateInstansiSessionSchema.safeParse({ ...valid, pin: "123" }).success,
    ).toBe(false);
    expect(
      CreateInstansiSessionSchema.safeParse({ ...valid, pin: "1234" }).success,
    ).toBe(true);
  });

  it("rejects empty testIds and past expiry", () => {
    expect(
      CreateInstansiSessionSchema.safeParse({ ...valid, testIds: [] }).success,
    ).toBe(false);
    expect(
      CreateInstansiSessionSchema.safeParse({
        ...valid,
        expiresAt: localInput(-60_000),
      }).success,
    ).toBe(false);
  });
});
