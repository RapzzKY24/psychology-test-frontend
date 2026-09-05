import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Verifikasi Pembayaran" };

export default function PembayaranPage() {
  return (
    <SectionPlaceholder
      title="Pembayaran"
      description="Verifikasi pembayaran QRIS manual berdasarkan kode unik."
    />
  );
}
