import { BadgeCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import { cn } from "@/lib/utils";
import type { InvoiceVerification } from "@/lib/api/types";

const STATUS_LABEL: Record<InvoiceVerification["status"], string> = {
  UNPAID: "Belum Dibayar",
  PAID: "Lunas",
  CANCELLED: "Dibatalkan",
};

interface InvoiceVerificationCardProps {
  invoice: InvoiceVerification;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}

export function InvoiceVerificationCard({ invoice }: InvoiceVerificationCardProps) {
  const isCancelled = invoice.status === "CANCELLED";
  const isPaid = invoice.status === "PAID";

  const Icon = isCancelled ? ShieldX : isPaid ? BadgeCheck : ShieldAlert;
  const title = isCancelled ? "Dokumen dibatalkan" : "Dokumen tervalidasi";
  const description = isCancelled
    ? "Invoice ini sudah dibatalkan dan tidak boleh dibayar."
    : "Diterbitkan melalui sistem Psychology Test.";

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div
        className={cn(
          "flex items-start gap-3 border-b px-6 py-5",
          isCancelled ? "bg-destructive/5" : "bg-muted/40",
        )}
      >
        <Icon
          className={cn(
            "mt-0.5 size-5 shrink-0",
            isCancelled ? "text-destructive" : "text-primary",
          )}
          aria-hidden
        />
        <div className="space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <dl className="divide-y px-6 py-3">
        <Row label="Nomor Invoice" value={invoice.number} />
        <Row label="Institusi" value={invoice.institutionName} />
        <Row label="Nominal" value={formatIdr(invoice.amount)} />
        <Row label="Tanggal Terbit" value={formatIdDate(invoice.issuedAt)} />
        {invoice.dueDate ? (
          <Row label="Jatuh Tempo" value={formatIdDate(invoice.dueDate)} />
        ) : null}
        {invoice.payment ? (
          <Row
            label="Nomor Virtual Account"
            value={`${invoice.payment.bank} — ${invoice.payment.vaNumber}`}
          />
        ) : null}
        {invoice.paidAt ? (
          <Row label="Tanggal Bayar" value={formatIdDate(invoice.paidAt)} />
        ) : null}
        <div className="flex items-center justify-between gap-6 py-2.5">
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>
            <Badge variant={isCancelled ? "destructive" : isPaid ? "default" : "secondary"}>
              {STATUS_LABEL[invoice.status]}
            </Badge>
          </dd>
        </div>
      </dl>

      <div className="border-t bg-muted/40 px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Cocokkan nomor invoice dan nominal di atas dengan dokumen yang Anda
          pegang. Kalau berbeda, jangan lakukan pembayaran.
        </p>
      </div>
    </div>
  );
}
