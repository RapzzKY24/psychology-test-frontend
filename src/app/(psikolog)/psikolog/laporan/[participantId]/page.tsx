import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ReportForm } from "@/features/psikolog/reports/components/report-form";
import { IssuedReportPanel } from "@/features/psikolog/reports/components/issued-report-panel";
import { ReportReadOnly } from "@/features/psikolog/reports/components/report-readonly-view";
import { fetchReportFormServer } from "@/features/psikolog/reports/api.server";
import { isApiError } from "@/lib/api/client";

export const metadata: Metadata = { title: "Isi Laporan" };

export default async function ReportFormPage({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;

  let form;
  try {
    form = (await fetchReportFormServer(participantId)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const isActive = form.report?.status === "ACTIVE";

  return (
    <main className="flex-1 space-y-6 p-6">
      <Link
        href="/psikolog/laporan"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke daftar laporan
      </Link>

      <PageHeader title={`Laporan ${form.participant.name}`} description={form.session.title} />

      {isActive ? (
        <div className="space-y-6">
          <IssuedReportPanel form={form} />
          <ReportReadOnly form={form} />
        </div>
      ) : (
        <ReportForm form={form} />
      )}
    </main>
  );
}
