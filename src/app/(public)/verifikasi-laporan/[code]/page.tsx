import type { Metadata } from "next";
import { findReportVerificationServer } from "@/features/public/api";
import { ReportVerificationCard } from "@/features/public/components/report-verification-card";

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
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Verifikasi Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Halaman ini menampilkan data laporan yang tersimpan di sistem kami.
        </p>
      </header>

      {report ? (
        <ReportVerificationCard report={report} />
      ) : (
        <ReportVerificationCard report={{ valid: false }} />
      )}
    </main>
  );
}
