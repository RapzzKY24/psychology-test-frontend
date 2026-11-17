import type { Metadata } from "next";
import { PUBLIC_COPY } from "@/features/public/copy";
import { findReportVerificationServer } from "@/features/public/api";
import { ReportVerificationCard } from "@/features/public/components/report-verification-card";
import { VerificationIntro } from "@/features/public/components/verification-intro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verifikasi Laporan",
  robots: { index: false, follow: false },
};

/** Target of the QR printed on page 4 of the report PDF. */
export default async function VerifikasiLaporanPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const report = await findReportVerificationServer(code);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16">
      <VerificationIntro
        title="Verifikasi Laporan"
        description={PUBLIC_COPY.verification.reportDescription}
      />

      {report ? (
        <ReportVerificationCard report={report} />
      ) : (
        <ReportVerificationCard report={{ valid: false }} />
      )}
    </main>
  );
}
