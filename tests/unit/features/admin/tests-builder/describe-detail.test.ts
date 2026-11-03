import { describe, expect, it } from "vitest";
import { describeDetail } from "@/features/admin/tests-builder/hooks/use-builder-form";

describe("describeDetail", () => {
  it("translates the empty-test publish failure", () => {
    expect(describeDetail("test must have at least 1 item")).toBe(
      "Tes harus punya minimal 1 soal sebelum dipublish.",
    );
  });

  it("names the failing item by its 1-based number", () => {
    expect(describeDetail("items[3]: options.1: Opsi wajib diisi.")).toBe(
      "Soal #4: options.1: Opsi wajib diisi.",
    );
  });

  it("passes unknown details through", () => {
    expect(describeDetail("something new")).toBe("something new");
  });
});
