import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Hasil" };

export default function HasilPage() {
  return (
    <SectionPlaceholder
      title="Hasil"
      description="Monitor hasil peserta dan resubmit hasil returned."
    />
  );
}
