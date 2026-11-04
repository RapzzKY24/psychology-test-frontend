import type { Metadata } from "next";
import { findCertificateVerificationServer } from "@/features/public/api";
import { CertificateVerificationCard } from "@/features/public/components/certificate-verification-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat",
  robots: { index: false, follow: false },
};

/** Target of the QR printed on the certificate PDF. */
export default async function VerifikasiSertifikatPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await findCertificateVerificationServer(code);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Verifikasi Sertifikat</h1>
        <p className="text-sm text-muted-foreground">
          Halaman ini menampilkan data sertifikat yang tersimpan di sistem kami.
        </p>
      </header>

      <CertificateVerificationCard certificate={certificate ?? { valid: false }} />
    </main>
  );
}
