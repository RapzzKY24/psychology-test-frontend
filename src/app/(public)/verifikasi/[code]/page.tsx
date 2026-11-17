import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { PUBLIC_COPY } from "@/features/public/copy";
import {
  findCertificateVerificationServer,
  findReportVerificationServer,
} from "@/features/public/api";
import { CertificateVerificationCard } from "@/features/public/components/certificate-verification-card";
import { ReportVerificationCard } from "@/features/public/components/report-verification-card";
import { VerificationIntro } from "@/features/public/components/verification-intro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verifikasi Dokumen",
  robots: { index: false, follow: false },
};

/**
 * One code, two possible documents. Report first, certificate second; an
 * unknown code is answered neutrally so the page does not leak existence.
 */
export default async function VerifikasiCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = code.trim().toUpperCase();

  const [report, certificate] = await Promise.all([
    findReportVerificationServer(normalized).catch(() => null),
    findCertificateVerificationServer(normalized).catch(() => null),
  ]);

  const validReport = report?.valid ? report : null;
  const validCertificate = certificate?.valid ? certificate : null;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-14 sm:px-6 sm:py-16">
      <VerificationIntro
        title={PUBLIC_COPY.verification.indexTitle}
        description={PUBLIC_COPY.verification.indexDescription}
      />

      {validReport ? (
        <ReportVerificationCard report={validReport} />
      ) : validCertificate ? (
        <CertificateVerificationCard certificate={validCertificate} />
      ) : (
        <div className="bg-card rounded-2xl border p-6 text-center">
          <ShieldX className="text-destructive mx-auto size-8" aria-hidden />
          <p className="mt-3 font-medium">{PUBLIC_COPY.verification.notFoundTitle}</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {PUBLIC_COPY.verification.notFoundBody}
          </p>
        </div>
      )}

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/verifikasi" className="text-primary font-medium hover:underline">
          Cek kode lain
        </Link>
        {" · "}
        <Link href="/bantuan#verifikasi" className="text-primary font-medium hover:underline">
          Panduan verifikasi
        </Link>
      </p>
    </main>
  );
}
