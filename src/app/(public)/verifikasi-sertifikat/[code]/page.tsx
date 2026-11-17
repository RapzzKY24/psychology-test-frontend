import type { Metadata } from "next";
import { PUBLIC_COPY } from "@/features/public/copy";
import { findCertificateVerificationServer } from "@/features/public/api";
import { CertificateVerificationCard } from "@/features/public/components/certificate-verification-card";
import { VerificationIntro } from "@/features/public/components/verification-intro";

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
      <VerificationIntro
        title="Verifikasi Sertifikat"
        description={PUBLIC_COPY.verification.certificateDescription}
      />

      <CertificateVerificationCard certificate={certificate ?? { valid: false }} />
    </main>
  );
}
