import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CopyInviteButton } from "@/features/admin/sessions/components/copy-invite-button";
import { CloseSessionButton } from "@/features/admin/sessions/components/close-session-button";
import { fetchSessionDetailServer } from "@/features/admin/sessions/api.server";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
        description={`Status: ${detail.session.status} · slot ${detail.session.slotLimit} · kedaluwarsa ${formatIdDate(detail.session.expiresAt)}`}
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
            <li key={test.id} className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
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
          Peserta <span className="text-sm text-muted-foreground tabular-nums">({detail.participants.length})</span>
        </h2>
        {detail.participants.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Belum ada peserta yang join.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. Peserta</TableHead>
                  <TableHead>Join</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell>{participant.email ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">{participant.candidateNumber ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">{formatIdDate(participant.joinedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">
          Attempt <span className="text-sm text-muted-foreground tabular-nums">({detail.attempts.length})</span>
        </h2>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{detail.tests.find((t) => t.testId === attempt.testId)?.testName ?? attempt.testId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{attempt.status}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{formatIdDate(attempt.startedAt)}</TableCell>
                  <TableCell className="tabular-nums">{formatIdDate(attempt.completedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
