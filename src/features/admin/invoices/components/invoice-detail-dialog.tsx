"use client";

import Image from "next/image";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInvoiceDetail } from "../hooks/use-invoice-detail";
import { useDownloadInvoicePdf } from "../hooks/use-download-invoice-pdf";
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
  const download = useDownloadInvoicePdf();

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

        {data ? (
          <Button
            variant="secondary"
            className="w-full"
            disabled={download.isPending}
            onClick={() =>
              download.mutate({ id: data.id, number: data.number })
            }
          >
            <Download className="size-4" aria-hidden />
            {download.isPending ? "Menyiapkan PDF…" : "Unduh PDF"}
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
