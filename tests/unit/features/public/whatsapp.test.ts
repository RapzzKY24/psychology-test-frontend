import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "@/features/public/whatsapp";

describe("buildWhatsAppLink", () => {
  it("builds a wa.me deep link with encoded text", () => {
    expect(buildWhatsAppLink("6281234567890", "Halo saya ingin info instansi")).toBe(
      "https://wa.me/6281234567890?text=Halo%20saya%20ingin%20info%20instansi",
    );
  });

  it("normalizes loose input and falls back to a WhatsApp home when no number", () => {
    expect(buildWhatsAppLink("62-812-3456-7890 ", "halo")).toBe("https://wa.me/6281234567890?text=halo");
    expect(buildWhatsAppLink("", "halo")).toContain("https://wa.me/?text=halo");
  });
});
