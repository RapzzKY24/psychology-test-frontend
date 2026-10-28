import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyInviteButton } from "@/components/shared/copy-invite-button";
import { SESSION_STATUS_LABEL } from "@/lib/constants/session-status";
import type { SessionSummary } from "@/lib/api/types";

export function RecentSessionsCard({ sessions }: { sessions: SessionSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sesi terbaru</CardTitle>
        <CardDescription>5 sesi terakhir beserta tautan undangan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada sesi.{" "}
            <Link href="/instansi/buat-sesi" className="underline underline-offset-4">
              Buat sesi pertama
            </Link>
            .
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/instansi/sesi/${session.id}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {session.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {SESSION_STATUS_LABEL[session.status]} · slot {session.slotLimit}
                </p>
              </div>
              {session.status === "ACTIVE" ? (
                <CopyInviteButton token={session.token} />
              ) : session.status === "PENDING_PAYMENT" ? (
                <Button asChild size="sm">
                  <Link href={`/instansi/sesi/${session.id}`}>Bayar</Link>
                </Button>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
