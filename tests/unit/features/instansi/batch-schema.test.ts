import { describe, expect, it } from "vitest";
import { CreateBatchSchema } from "@/features/instansi/sessions/schemas";

const valid = { testIds: ["t1"], slotLimit: 10 };

describe("CreateBatchSchema", () => {
  it("accepts at least one test and a positive slot count", () => {
    expect(CreateBatchSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty test selection", () => {
    const result = CreateBatchSchema.safeParse({ ...valid, testIds: [] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Pilih minimal satu tes.");
  });

  it("rejects zero slots", () => {
    const result = CreateBatchSchema.safeParse({ ...valid, slotLimit: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Jumlah peserta minimal 1.");
  });

  it("rejects more slots than the backend allows", () => {
    const result = CreateBatchSchema.safeParse({ ...valid, slotLimit: 1001 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Jumlah peserta maksimal 1000.");
  });

  it("rejects fractional slots", () => {
    const result = CreateBatchSchema.safeParse({ ...valid, slotLimit: 2.5 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Jumlah peserta harus bilangan bulat.");
  });

  it("explains a non-numeric input in Indonesian", () => {
    const result = CreateBatchSchema.safeParse({ ...valid, slotLimit: "dua puluh" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Jumlah peserta harus berupa angka.");
  });
});
