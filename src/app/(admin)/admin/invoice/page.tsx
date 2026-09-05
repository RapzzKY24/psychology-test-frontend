import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Invoice B2B" };

export default function InvoicePage() {
  return (
    <SectionPlaceholder
      title="Invoice"
      description="Tagihan B2B dan status pembayarannya."
    />
  );
}
