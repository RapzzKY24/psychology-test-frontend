"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyInviteButton } from "@/features/admin/sessions/components/copy-invite-button";
import { fetchInstansiSessionDetail } from "@/features/instansi/sessions/api";
import { formatIdr } from "@/lib/format/format-idr";
import { qk } from "@/lib/api/query-keys";
import type { InstansiInvoice } from "@/lib/api/types";
import { fetchInstansiInvoice } from "../api";
import { INVOICE_POLL_MS, INVOICE_STATUS_LABEL, bankLabel } from "../constants";
import { CopyValueButton } from "./copy-value-button";
import { InvoiceCountdown } from "./invoice-countdown";

/**
 * Client island for the checkout page: polls the invoice until it is PAID,
 * then reveals the shareable invite link (token from the session detail).
 */
export function InvoiceIsland({ initial }: { initial: InstansiInvoice }) {
  const invoiceQuery = useQuery({
    queryKey: qk.instansi.invoices.detail(initial.id),
    queryFn: async () => (await fetchInstansiInvoice(initial.id)).data,
    initialData: initial,
    refetchInterval: (query) => (query.state.data?.status === "UNPAID" ? INVOICE_POLL_MS : false),
  });

  const invoice = invoiceQuery.data;
  const isPaid = invoice.status === "PAID";

  const sessionQuery = useQuery({
    queryKey: qk.instansi.sessions.detail(invoice.sessionId ?? "none"),
    queryFn: async () => (await fetchInstansiSessionDetail(invoice.sessionId as string)).data,
    enabled: isPaid && invoice.sessionId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const token = sessionQuery.data?.session.token;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Tagihan {invoice.number}</CardTitle>
            <CardDescription>
              {isPaid
                ? "Pembayaran diterima — sesi sudah aktif."
                : "Selesaikan pembayaran untuk membuka sesi peserta."}
            </CardDescription>
          </div>
          <Badge variant={isPaid ? "default" : "secondary"}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase">Jumlah</p>
          <p className="font-heading text-2xl font-semibold tabular-nums">
            {formatIdr(invoice.amount)}
          </p>
        </div>

        {isPaid ? (
          <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="size-5" aria-hidden />
              <span className="font-medium">Sesi aktif — bagikan link ke peserta</span>
            </div>
            {token ? (
              <CopyInviteButton token={token} label="Salin Link Peserta" />
            ) : (
              <p className="text-muted-foreground text-sm">Menyiapkan tautan…</p>
            )}
          </div>
        ) : (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            {invoice.vaNumber ? (
              <>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">
                    {bankLabel(invoice.vaBankCode)}
                  </p>
                  <p className="font-heading text-xl font-semibold tracking-wide tabular-nums">
                    {invoice.vaNumber}
                  </p>
                </div>
                <CopyValueButton
                  value={invoice.vaNumber}
                  label="Salin Nomor VA"
                  toastMessage="Nomor VA disalin."
                />
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nomor Virtual Account sedang dibuat — halaman ini akan memperbarui otomatis.
              </p>
            )}
            {invoice.expiresAt && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-4" aria-hidden />
                Bayar sebelum: <InvoiceCountdown expiresAt={invoice.expiresAt} />
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
