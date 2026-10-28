import { describe, expect, it } from "vitest";
import { formatInvoiceFilename } from "@/lib/format/format-invoice-filename";

describe("formatInvoiceFilename", () => {
  it("keeps a plain number readable", () => {
    expect(formatInvoiceFilename("INV-2026-0001")).toBe(
      "Invoice-INV-2026-0001.pdf",
    );
  });

  it("replaces slashes so the name cannot break the path", () => {
    expect(formatInvoiceFilename("INV/2026/10/001")).toBe(
      "Invoice-INV-2026-10-001.pdf",
    );
  });
});
