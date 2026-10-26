"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatIdr } from "@/lib/format/format-idr";
import type { CheckoutStatusResult } from "@/lib/api/types";
import { SETTLED_HINTS } from "../constants";
import { useCheckoutStatus } from "../hooks/use-checkout-status";

type View = "paid" | "verifying" | "waiting" | "failed";

interface CheckoutResultProps {
  initial: CheckoutStatusResult;
  /** `transaction_status` from the Snap finish redirect — a hint, never proof. */
  hint?: string;
}

const VIEW: Record<View, { title: string; body: string }> = {
  paid: {
    title: "Pembayaran berhasil",
    body: "Pembayaran sudah diterima. Sesi tes aktif dan siap dibagikan.",
  },
  verifying: {
    title: "Pembayaran diterima — sedang diverifikasi",
    body: "Midtrans sudah mencatat pembayaran ini. Sistem sedang memperbarui tagihan; halaman ini menyegarkan sendiri.",
  },
  waiting: {
    title: "Menunggu pembayaran",
    body: "Pembayaran belum masuk. Selesaikan pembayaran, lalu halaman ini akan diperbarui otomatis.",
  },
  failed: {
    title: "Pembayaran tidak berhasil",
    body: "Transaksi dibatalkan atau sudah kedaluwarsa. Silakan buat pesanan baru.",
  },
};

/** Resolves the DB status (+ Snap hint) into the four states a buyer can see. */
function resolveView(checkout: CheckoutStatusResult, hint?: string): View {
  if (checkout.status === "PAID") return "paid";
  if (checkout.status === "CANCELLED" || checkout.status === "EXPIRED") return "failed";
  const settled = hint !== undefined && (SETTLED_HINTS as readonly string[]).includes(hint);
  return settled ? "verifying" : "waiting";
}

function primaryAction(checkout: CheckoutStatusResult, view: View) {
  if (view === "paid") {
    if (checkout.kind === "invoice") {
      return {
        href: checkout.sessionId ? `/instansi/sesi/${checkout.sessionId}` : "/instansi/sesi",
        label: "Isi peserta sekarang",
      };
    }
    return { href: "/dashboard", label: "Mulai tes" };
  }
  if (view === "waiting" && checkout.kind === "invoice") {
    return { href: `/instansi/tagihan/${checkout.id}`, label: "Lihat tagihan" };
  }
  if (view === "failed") {
    return { href: "/tes", label: "Beli lagi" };
  }
  return {
    href: checkout.kind === "invoice" ? "/instansi/sesi" : "/dashboard",
    label: "Ke dashboard",
  };
}

/**
 * Payment result page. It never claims success from the redirect alone: the
 * invoice/order status in the database decides, the Snap hint only explains why
 * a paid transaction may still read as unpaid.
 */
export function CheckoutResult({ initial, hint }: CheckoutResultProps) {
  const query = useCheckoutStatus(initial);
  const checkout = query.data;
  const view = resolveView(checkout, hint);
  const copy = VIEW[view];
  const action = primaryAction(checkout, view);

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <Image
          src="/logo/logopsikologi.jpeg"
          alt="Psikologi"
          width={64}
          height={64}
          className="size-16 rounded-full object-cover"
        />

        <StatusIcon view={view} />

        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <p className="text-muted-foreground text-sm">{copy.body}</p>
        </div>

        <div className="w-full space-y-2 rounded-lg border bg-muted/40 p-3 text-left">
          <p className="text-muted-foreground text-xs uppercase">Tes</p>
          <ul className="space-y-1">
            {checkout.testNames.map((name) => (
              <li key={name} className="text-sm font-medium">
                {name}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-2 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-heading font-semibold tabular-nums">
              {formatIdr(checkout.amount)}
            </span>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={action.href}>{action.label}</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href={checkout.kind === "invoice" ? "/instansi" : "/dashboard"}>Ke dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ view }: { view: View }) {
  if (view === "paid") return <CheckCircle2 className="size-10 text-emerald-600" aria-hidden />;
  if (view === "verifying")
    return <Loader2 className="text-primary size-10 animate-spin" aria-hidden />;
  if (view === "waiting") return <Clock className="size-10 text-amber-500" aria-hidden />;
  return <XCircle className="text-destructive size-10" aria-hidden />;
}
