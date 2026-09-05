import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";

export const metadata: Metadata = { title: "Manajemen Pengguna" };

export default function PenggunaPage() {
  return (
    <SectionPlaceholder
      title="Pengguna"
      description="Kelola akun dan role pengguna platform."
    />
  );
}
