"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import type { AdminInvoiceDetail } from "@/lib/api/types";
import { useInvoiceDetail } from "../hooks/use-invoice-detail";
import { InvoiceStatusBadge } from "./invoice-status-badge";

/** Who confirmed the payment, in words an admin can act on. */
const SOURCE_LABEL: Record<string, string> = {
  MIDTRANS: "Midtrans",
  ADMIN: "Verifikasi admin",
  MANUAL: "Input manual",
};

/**
 * Row detail popup: what was bought, for how much, by which institution, and
 * where the payment stands. Opened by clicking a row in the invoice table.
 */
export function InvoiceDetailDialog({
  invoiceId,
  onClose,
}: {
  invoiceId: string | null;
  onClose: () => void;
}) {
  const { data, isPending, isError } = useInvoiceDetail(invoiceId);

  return (
    <Dialog
      open={invoiceId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center text-center">
          <Image
            src="/logo/logopsikologi.jpeg"
            alt="Psikotes"
            width={173}
            height={50}
            className="mb-1 h-8 w-auto"
          />
          <DialogTitle className="tabular-nums">{data?.number ?? "Invoice"}</DialogTitle>
          <DialogDescription>Rincian tagihan institusi.</DialogDescription>
        </DialogHeader>

        {isError ? (
          <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" aria-hidden />
            Gagal memuat rincian invoice.
          </p>
        ) : isPending || !data ? (
          <DetailSkeleton />
        ) : (
          <DetailBody invoice={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({ invoice }: { invoice: AdminInvoiceDetail }) {
  const testNames = invoice.session?.testNames ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <InvoiceStatusBadge status={invoice.status} />
        <span className="text-muted-foreground text-xs">
          {invoice.paidAt ? `Dibayar ${formatIdDate(invoice.paidAt)}` : "Belum dibayar"}
        </span>
      </div>

      <Separator />

      <section className="space-y-1">
        <p className="text-muted-foreground text-xs uppercase">Institusi</p>
        <p className="font-medium">{invoice.institution?.name ?? "—"}</p>
      </section>

      <section className="space-y-1">
        <p className="text-muted-foreground text-xs uppercase">Yang dibeli</p>
        {testNames.length > 0 ? (
          <ul className="space-y-1">
            {testNames.map((name) => (
              <li key={name} className="flex items-start gap-2 text-sm">
                <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden />
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">—</p>
        )}
        {invoice.session ? (
          <p className="text-muted-foreground text-xs">
            {invoice.session.title} · {invoice.session.slotLimit} peserta
          </p>
        ) : null}
      </section>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
        <span className="text-muted-foreground text-sm">Total tagihan</span>
        <span className="font-heading font-semibold tabular-nums">
          {formatIdr(invoice.amount)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <Row label="Terbit" value={formatIdDate(invoice.issuedAt)} />
        <Row label="Jatuh tempo" value={formatIdDate(invoice.dueDate)} />
        <Row label="Metode" value={invoice.paymentType ?? "—"} />
        <Row
          label="Sumber"
          value={
            invoice.verifiedBySource
              ? (SOURCE_LABEL[invoice.verifiedBySource] ?? invoice.verifiedBySource)
              : "—"
          }
        />
      </dl>

      {invoice.notes ? (
        <section className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase">Catatan</p>
          <p className="text-sm">{invoice.notes}</p>
        </section>
      ) : null}

      {invoice.session ? (
        <Badge variant="outline" className="font-normal">
          Sesi {invoice.session.status.toLowerCase().replaceAll("_", " ")}
        </Badge>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-3" aria-busy>
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
