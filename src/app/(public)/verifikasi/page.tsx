import type { Metadata } from "next";
import Link from "next/link";
import { PUBLIC_COPY } from "@/features/public/copy";
import { VerificationIntro } from "@/features/public/components/verification-intro";
import { VerificationLookup } from "@/features/public/components/verification-lookup";

export const metadata: Metadata = {
  title: "Verifikasi Dokumen",
  description:
    "Periksa keaslian laporan atau sertifikat mypsikolog.id dengan kode yang tercetak di dokumen.",
};

export default function VerifikasiPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-14 sm:px-6 sm:py-16">
      <VerificationIntro
        title={PUBLIC_COPY.verification.indexTitle}
        description={PUBLIC_COPY.verification.indexDescription}
      />

      <div className="bg-card rounded-2xl border p-5 sm:p-6">
        <VerificationLookup autoFocus />
      </div>

      <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
        <p>
          Kode tercetak di dekat QR pada dokumen: laporan di halaman terakhir, sertifikat, atau
          invoice. Di layar, kode tampil di halaman dokumen terkait.
        </p>
        <p>
          Halaman ini hanya menampilkan status dan identitas yang diperlukan — bukan skor.{" "}
          <Link
            href="/bantuan#verifikasi"
            className="text-primary font-medium underline underline-offset-4"
          >
            Baca panduan verifikasi
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
