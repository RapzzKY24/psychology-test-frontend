"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyValueButton } from "@/components/shared/copy-value-button";
import { ExpiryCountdown } from "@/components/shared/expiry-countdown";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { OrderDetail } from "@/lib/api/types";
import { formatIdr } from "@/lib/format/format-idr";
import { orderAttemptTarget } from "@/lib/order-attempt";
import { reconcileCheckoutStatus } from "../api";
import { useOrderDetail } from "../hooks/use-order-detail";

interface PaymentDialogProps {
  /** Null keeps the dialog closed; a create response or a history row supplies it. */
  orderId: string | null;
  testName: string;
  onClose: () => void;
}

/**
 * The one payment surface for personal orders. It always reads the order from
 * the server, so the countdown and the status cannot drift from the database;
 * the create response only tells it which order to open.
 */
export function PaymentDialog({ orderId, testName, onClose }: PaymentDialogProps) {
  const query = useOrderDetail(orderId);

  return (
    <Dialog
      open={Boolean(orderId)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran {testName}</DialogTitle>
          <DialogDescription>
            {query.data?.status === "PAID"
              ? "Pembayaran sudah kami terima."
              : "Selesaikan pembayaran sebelum batas waktu berakhir."}
          </DialogDescription>
        </DialogHeader>

        {query.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : query.isError ? (
          <div className="space-y-3 py-2 text-center">
            <p className="text-muted-foreground text-sm">
              Detail pembayaran gagal dimuat.
            </p>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              Coba lagi
            </Button>
          </div>
        ) : query.data ? (
          <OrderBody order={query.data} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function OrderBody({ order, onClose }: { order: OrderDetail; onClose: () => void }) {
  if (order.status === "PAID") return <PaidBody order={order} onClose={onClose} />;
  if (order.status === "PENDING") return <PayableBody order={order} />;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {order.status === "EXPIRED"
          ? "Waktu pembayaran sudah lewat. Silakan mulai lagi untuk mencoba ulang."
          : "Pembayaran ini sudah dibatalkan."}
      </p>
      <Button variant="outline" className="w-full" onClick={onClose}>
        Tutup
      </Button>
    </div>
  );
}

function PaidBody({ order, onClose }: { order: OrderDetail; onClose: () => void }) {
  const target = orderAttemptTarget(order.attempt);
  const label = target
    ? target.kind === "work"
      ? "Kerjakan Sekarang"
      : "Lihat Hasil"
    : "Buka Dashboard";

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p className="text-sm">
          Pembayaran diterima. Tes sudah bisa Anda kerjakan.
        </p>
      </div>
      <Button asChild className="w-full" onClick={onClose}>
        <Link href={target?.href ?? "/dashboard"}>{label}</Link>
      </Button>
    </div>
  );
}

function PayableBody({ order }: { order: OrderDetail }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs uppercase">Total biaya</p>
            {order.uniqueCode > 0 && (
              <p className="text-muted-foreground text-xs">
                {formatIdr(order.basePrice)} + kode unik {order.uniqueCode}
              </p>
            )}
          </div>
          <p className="font-heading text-xl font-semibold tabular-nums">
            {formatIdr(order.amount)}
          </p>
        </div>
        <p className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
          <Clock className="size-4" aria-hidden />
          Selesaikan dalam <ExpiryCountdown expiresAt={order.expiresAt} />
        </p>
      </div>

      <PaymentInstructions order={order} />
      <CheckPaymentButton orderId={order.id} />
    </div>
  );
}

function PaymentInstructions({ order }: { order: OrderDetail }) {
  if (order.paymentUrl) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Halaman pembayaran dibuka di tab yang sama. Setelah selesai, Anda kembali ke
          sini otomatis.
        </p>
        <Button asChild className="w-full">
          <a href={order.paymentUrl}>
            Lanjut ke Pembayaran
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      </div>
    );
  }

  if (order.vaNumber) {
    return (
      <div className="space-y-2 rounded-lg border p-4">
        <p className="text-muted-foreground flex items-center gap-1 text-xs uppercase">
          <Wallet className="size-3.5" aria-hidden />
          {order.vaBankCode ? `Virtual Account ${order.vaBankCode.toUpperCase()}` : "Virtual Account"}
        </p>
        <p className="font-heading text-lg font-semibold tracking-wide tabular-nums">
          {order.vaNumber}
        </p>
        <CopyValueButton
          value={order.vaNumber}
          label="Salin Nomor VA"
          toastMessage="Nomor VA disalin."
        />
      </div>
    );
  }

  if (order.qrisImageUrl) {
    return (
      <div className="space-y-2 rounded-lg border p-4 text-center">
        <p className="text-muted-foreground flex items-center justify-center gap-1 text-xs uppercase">
          <QrCode className="size-3.5" aria-hidden />
          Pindai QRIS
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={order.qrisImageUrl}
          alt="Kode QRIS pembayaran"
          className="mx-auto size-48 rounded-md border bg-white object-contain p-2"
        />
        <p className="text-muted-foreground text-sm">
          Nominal sudah terisi otomatis — jangan diubah.
        </p>
      </div>
    );
  }

  return (
    <p className="text-muted-foreground text-sm">
      Instruksi pembayaran sedang disiapkan. Muat ulang status beberapa saat lagi.
    </p>
  );
}

function CheckPaymentButton({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();

  const reconcile = useMutation({
    mutationFn: () => reconcileCheckoutStatus(orderId),
    onSuccess: ({ data }) => {
      void queryClient.invalidateQueries({ queryKey: qk.orders.detail(orderId) });
      if (data.status === "PAID") toast.success("Pembayaran diterima.");
      else toast.info("Pembayaran belum masuk. Coba lagi beberapa saat.");
    },
    onError: () => toast.error(GENERIC_ERROR_MESSAGE),
  });

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={reconcile.isPending}
      onClick={() => reconcile.mutate()}
    >
      <RefreshCw
        className={reconcile.isPending ? "size-4 animate-spin" : "size-4"}
        aria-hidden
      />
      {reconcile.isPending ? "Memeriksa…" : "Saya sudah bayar"}
    </Button>
  );
}
