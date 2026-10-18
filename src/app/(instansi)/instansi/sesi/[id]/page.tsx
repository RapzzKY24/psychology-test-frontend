import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CopyInviteButton } from "@/features/admin/sessions/components/copy-invite-button";
import { fetchInstansiSessionDetailServer } from "@/features/instansi/sessions/api.server";
import { InstansiSessionDetailIsland } from "@/features/instansi/sessions/components/instansi-session-detail-island";
import { SESSION_STATUS_LABEL } from "@/features/admin/sessions/constants";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { qk } from "@/lib/api/query-keys";
import { CloseInstansiSessionButton } from "@/features/instansi/sessions/components/close-instansi-session-button";

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

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title={detail.session.title}
        description={`Status: ${SESSION_STATUS_LABEL[detail.session.status]} · kedaluwarsa ${formatIdDate(detail.session.expiresAt)}`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <CopyInviteButton token={detail.session.token} label="Salin Tautan Undangan" />
        {detail.session.status === "ACTIVE" && (
          <CloseInstansiSessionButton
            sessionId={detail.session.id}
            listKey={qk.instansi.sessions.all}
          />
        )}
        <Link href="/instansi/sesi" className="text-sm text-muted-foreground hover:underline">
          ← Kembali ke daftar sesi
        </Link>
      </div>

      <InstansiSessionDetailIsland sessionId={detail.session.id} initial={detail} />
    </main>
  );
}
