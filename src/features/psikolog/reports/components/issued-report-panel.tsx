import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportFormData } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";
import { ReportDownloadButton } from "./report-download-button";

/**
 * ACTIVE reports are frozen. Corrections go through an admin revision, which
 * keeps the number and moves the QR to the new revision.
 */
export function IssuedReportPanel({ form }: { form: ReportFormData }) {
  const report = form.report;
  if (!report) return null;

  return (
    <section className="space-y-4 rounded-lg border p-5">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <h2 className="text-base font-semibold">Laporan sudah diterbitkan</h2>
          <p className="text-sm text-muted-foreground">
            Dokumen ini terkunci. Koreksi nilai hanya bisa dilakukan admin lewat revisi baru.
          </p>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Nomor laporan</dt>
          <dd className="font-medium tabular-nums">{report.number ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Tanggal terbit</dt>
          <dd className="font-medium">{formatIdDate(report.issuedAt)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <ReportDownloadButton id={report.id} number={report.number} />
        <Button variant="outline" asChild>
          <Link href="/psikolog/laporan">Kembali ke daftar</Link>
        </Button>
      </div>
    </section>
  );
}
