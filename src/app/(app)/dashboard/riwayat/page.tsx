import type { Metadata } from "next";
import { ParticipantPlaceholder } from "@/features/participant/components/participant-placeholder";

export const metadata: Metadata = { title: "Riwayat" };

export default function RiwayatPage() {
  return (
    <ParticipantPlaceholder
      title="Riwayat"
      description="Semua tes yang pernah Anda kerjakan, lengkap dengan statusnya."
    />
  );
}
