import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Institusi" };

export default function InstitusiPage() {
  return (
    <SectionPlaceholder
      title="Institusi"
      description="Data institusi klien B2B dan kontaknya."
    />
  );
}
