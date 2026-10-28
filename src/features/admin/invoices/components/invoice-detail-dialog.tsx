"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvoiceDetail } from "../hooks/use-invoice-detail";
import { InvoiceDetailBody } from "./invoice-detail-body";
import { InvoiceDetailSkeleton } from "./invoice-detail-skeleton";

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
          <InvoiceDetailSkeleton />
        ) : (
          <InvoiceDetailBody invoice={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}
