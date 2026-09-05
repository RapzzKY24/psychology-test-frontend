import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CopyInviteButton } from "@/features/admin/sessions/components/copy-invite-button";
import { CloseSessionButton } from "@/features/admin/sessions/components/close-session-button";
import { SessionAttemptsTable } from "@/features/admin/sessions/components/session-attempts-table";
import { SessionParticipantsTable } from "@/features/admin/sessions/components/session-participants-table";
import { fetchSessionDetailServer } from "@/features/admin/sessions/api.server";
import { SESSION_STATUS_LABEL } from "@/features/admin/sessions/constants";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";

export const metadata: Metadata = { title: "Detail Sesi" };

export default async function SessionDetailPage({ params }: PageProps<"/admin/sesi/[id]">) {
  const { id } = await params;

  let detail;
  try {
    const response = await fetchSessionDetailServer(id);
    detail = response.data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title={detail.session.title}
        description={`Status: ${SESSION_STATUS_LABEL[detail.session.status]} · slot ${detail.session.slotLimit} · kedaluwarsa ${formatIdDate(detail.session.expiresAt)}`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <CopyInviteButton token={detail.session.token} label="Salin Tautan Undangan" />
        {detail.session.status === "ACTIVE" && <CloseSessionButton sessionId={detail.session.id} />}
        <Link href="/admin/sesi" className="text-sm text-muted-foreground hover:underline">
          ← Kembali ke daftar sesi
        </Link>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">Tes dalam sesi (berurutan)</h2>
        <ol className="space-y-1.5">
          {detail.tests.map((test) => (
            <li
              key={test.id}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary tabular-nums">
                {test.order}
              </span>
              {test.testName}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">
          Peserta{" "}
          <span className="text-sm text-muted-foreground tabular-nums">
            ({detail.participants.length})
          </span>
        </h2>
        <SessionParticipantsTable participants={detail.participants} />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">
          Attempt{" "}
          <span className="text-sm text-muted-foreground tabular-nums">
            ({detail.attempts.length})
          </span>
        </h2>
        <SessionAttemptsTable attempts={detail.attempts} tests={detail.tests} />
      </section>
    </main>
  );
}
