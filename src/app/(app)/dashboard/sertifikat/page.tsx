import type { Metadata } from "next";
import { ParticipantPlaceholder } from "@/features/participant/components/participant-placeholder";

export const metadata: Metadata = { title: "Sertifikat" };

export default function SertifikatPage() {
  return (
    <ParticipantPlaceholder
      title="Sertifikat"
      description="Sertifikat yang diterbitkan psikolog setelah hasil disetujui."
    />
  );
}
