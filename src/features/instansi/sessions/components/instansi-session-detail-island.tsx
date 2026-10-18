"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionStats } from "@/features/admin/sessions/components/session-stats";
import { InvoiceCountdown } from "@/features/instansi/invoices/components/invoice-countdown";
import { INVOICE_STATUS_LABEL } from "@/features/instansi/invoices/constants";
import { fetchInstansiSessionDetail } from "@/features/instansi/sessions/api";
import { InstansiRosterPanel } from "@/features/instansi/sessions/components/instansi-roster-panel";
import type { InstansiSessionDetail } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";
import { qk } from "@/lib/api/query-keys";

/** Client island for the instansi session detail: invoice summary + roster editor. */
export function InstansiSessionDetailIsland({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: InstansiSessionDetail;
}) {
  const { data } = useQuery({
    queryKey: qk.instansi.sessions.detail(sessionId),
    queryFn: () => fetchInstansiSessionDetail(sessionId).then((r) => r.data),
    initialData: initial,
    refetchInterval: (query) => (query.state.data?.invoice?.status === "UNPAID" ? 8000 : false),
  });

  const { session, participants, attempts, invoice } = data;
  const locked = invoice?.status !== "UNPAID";

  return (
    <div className="space-y-6">
      <SessionStats
        participants={participants.length}
        slotLimit={session.slotLimit}
        attempts={attempts}
      />

      {invoice && (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" aria-hidden />
              Tagihan {invoice.number}
            </CardTitle>
            <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
              {INVOICE_STATUS_LABEL[invoice.status]}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading text-xl font-semibold tabular-nums">
                {formatIdr(invoice.amount)}
              </p>
              {invoice.status === "UNPAID" && invoice.expiresAt && (
                <p className="text-muted-foreground text-sm">
                  Bayar sebelum: <InvoiceCountdown expiresAt={invoice.expiresAt} />
                </p>
              )}
            </div>
            {invoice.status === "UNPAID" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/instansi/tagihan/${invoice.id}`}>Lihat pembayaran</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <InstansiRosterPanel
        sessionId={sessionId}
        participants={participants}
        slotLimit={session.slotLimit}
        locked={locked}
      />
    </div>
  );
}
