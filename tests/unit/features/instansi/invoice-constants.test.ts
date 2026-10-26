import { describe, expect, it } from "vitest";
import {
  INVOICE_STATUS_LABEL,
  bankLabel,
  isInvoiceExpired,
} from "@/features/instansi/invoices/constants";

describe("invoice constants", () => {
  it("maps known bank codes to friendly names", () => {
    expect(bankLabel("014")).toBe("VA BCA");
  });

  it("falls back to the raw code for unknown banks", () => {
    expect(bankLabel("999")).toBe("VA 999");
  });

  it("falls back to a generic label when the code is null", () => {
    expect(bankLabel(null)).toBe("Virtual Account");
  });

  it("labels every invoice status in Indonesian", () => {
    expect(INVOICE_STATUS_LABEL.UNPAID).toBe("Menunggu Pembayaran");
    expect(INVOICE_STATUS_LABEL.PAID).toBe("Dibayar");
    expect(INVOICE_STATUS_LABEL.CANCELLED).toBe("Dibatalkan");
  });

  it("treats a past expiry as closed, and a missing one as open", () => {
    expect(isInvoiceExpired("2020-01-01T00:00:00.000Z")).toBe(true);
    expect(isInvoiceExpired("2099-01-01T00:00:00.000Z")).toBe(false);
    expect(isInvoiceExpired(null)).toBe(false);
  });
});
