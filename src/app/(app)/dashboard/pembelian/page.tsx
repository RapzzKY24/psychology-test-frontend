import type { Metadata } from "next";
import { ParticipantPlaceholder } from "@/features/participant/components/participant-placeholder";

export const metadata: Metadata = { title: "Pembelian" };

export default function PembelianPage() {
  return (
    <ParticipantPlaceholder
      title="Pembelian"
      description="Riwayat pembelian tes dan status pembayarannya."
    />
  );
}
