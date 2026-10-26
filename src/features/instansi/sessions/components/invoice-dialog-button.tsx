"use client";

import Link from "next/link";
import { Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceCountdown } from "@/features/instansi/invoices/components/invoice-countdown";
import { INVOICE_STATUS_LABEL } from "@/features/instansi/invoices/constants";
import type { InstansiSessionDetail } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";
import { useInstansiSessionDetail } from "../hooks/use-instansi-session-detail";

/**
 * Compact entry point for the batch invoice: a button in the page header that
 * opens the payment details in a dialog, so the invoice no longer takes a full
 * card on the session page. Shares the detail query, so it flips to "Dibayar"
 * without an extra request.
 */
export function InvoiceDialogButton({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: InstansiSessionDetail;
}) {
  const { data } = useInstansiSessionDetail(sessionId, initial);
  const invoice = data.invoice;
  if (!invoice) return null;

  const isPaid = invoice.status === "PAID";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isPaid ? "outline" : "default"} size="sm" className="gap-2">
          <CreditCard className="size-4" aria-hidden />
          Pembayaran
          <Badge variant={isPaid ? "secondary" : "outline"}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tagihan {invoice.number}</DialogTitle>
          <DialogDescription>Satu tagihan untuk seluruh slot pada sesi ini.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge variant={isPaid ? "default" : "secondary"}>
              {INVOICE_STATUS_LABEL[invoice.status]}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">Jumlah</span>
            <span className="font-heading font-semibold tabular-nums">
              {formatIdr(invoice.amount)}
            </span>
          </div>
          {!isPaid && invoice.expiresAt && (
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <Clock className="size-4" aria-hidden />
              Bayar sebelum: <InvoiceCountdown expiresAt={invoice.expiresAt} />
            </p>
          )}

          <Button asChild className="w-full">
            <Link href={`/instansi/tagihan/${invoice.id}`}>
              {isPaid ? "Lihat detail pembayaran" : "Bayar sekarang"}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
