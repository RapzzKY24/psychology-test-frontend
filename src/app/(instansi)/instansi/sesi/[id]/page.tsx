import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CopyInviteButton } from "@/components/shared/copy-invite-button";
import { fetchInstansiSessionDetailServer } from "@/features/instansi/sessions/api.server";
import { InstansiSessionDetailIsland } from "@/features/instansi/sessions/components/instansi-session-detail-island";
import { SESSION_STATUS_LABEL } from "@/lib/constants/session-status";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { CloseInstansiSessionButton } from "@/features/instansi/sessions/components/close-instansi-session-button";
import { InvoiceDialogButton } from "@/features/instansi/sessions/components/invoice-dialog-button";

export const metadata: Metadata = { title: "Detail Sesi" };

export default async function InstansiSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let detail;
  try {
    const response = await fetchInstansiSessionDetailServer(id);
    detail = response.data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const isActive = detail.session.status === "ACTIVE";

  return (
    <main className="flex-1 space-y-6 p-6">
      <Link
        href="/instansi/sesi"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke daftar sesi
      </Link>

      <PageHeader
        title={detail.session.title}
        description={`Status: ${SESSION_STATUS_LABEL[detail.session.status]} · kedaluwarsa ${formatIdDate(detail.session.expiresAt)}`}
      />

      <div className="bg-card flex flex-wrap items-center gap-2 rounded-xl border p-2 shadow-xs">
        <InvoiceDialogButton sessionId={detail.session.id} initial={detail} />
        <CopyInviteButton
          token={detail.session.token}
          label="Salin Tautan Undangan"
          disabled={!isActive}
          disabledReason="Tautan undangan bisa dibagikan setelah pembayaran diterima."
        />
        {isActive && <CloseInstansiSessionButton sessionId={detail.session.id} />}
      </div>

      <InstansiSessionDetailIsland sessionId={detail.session.id} initial={detail} />
    </main>
  );
}
