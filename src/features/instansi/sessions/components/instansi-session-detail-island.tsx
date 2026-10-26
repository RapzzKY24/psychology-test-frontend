"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionStats } from "@/components/shared/session-stats";
import { InvoiceCountdown } from "@/features/instansi/invoices/components/invoice-countdown";
import { INVOICE_STATUS_LABEL } from "@/features/instansi/invoices/constants";
import { InstansiRosterPanel } from "@/features/instansi/sessions/components/instansi-roster-panel";
import { useInstansiSessionDetail } from "@/features/instansi/sessions/hooks/use-instansi-session-detail";
import type { InstansiSessionDetail } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";

/** Client island for the instansi session detail: invoice summary + roster editor. */
export function InstansiSessionDetailIsland({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: InstansiSessionDetail;
}) {
  const { data } = useInstansiSessionDetail(sessionId, initial);
  const { session, participants, attempts, invoice } = data;

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
        status={session.status}
      />
    </div>
  );
}
