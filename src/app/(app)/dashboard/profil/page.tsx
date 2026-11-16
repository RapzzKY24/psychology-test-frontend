import type { Metadata } from "next";
import { ParticipantPlaceholder } from "@/features/participant/components/participant-placeholder";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilPage() {
  return (
    <ParticipantPlaceholder
      title="Profil"
      description="Data akun yang dipakai untuk laporan dan sertifikat."
    />
  );
}
