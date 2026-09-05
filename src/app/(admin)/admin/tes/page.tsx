import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Manajemen Tes" };

export default function TesPage() {
  return (
    <SectionPlaceholder
      title="Tes"
      description="Test Builder — soal, interpretasi, publish & archive."
    />
  );
}
