import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Sesi" };

export default function SesiPage() {
  return (
    <SectionPlaceholder
      title="Sesi"
      description="Sesi group, slot, PIN, dan tautan undangan."
    />
  );
}
