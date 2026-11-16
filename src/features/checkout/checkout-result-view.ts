import type { CheckoutStatusResult } from "@/lib/api/types";
import { SETTLED_HINTS } from "./constants";

export type CheckoutView = "paid" | "verifying" | "waiting" | "failed";

/** A link out of the page, or an in-place gateway check. */
export type PrimaryAction =
  | { kind: "link"; href: string; label: string }
  | { kind: "reconcile"; label: string };

export const CHECKOUT_VIEW_COPY: Record<CheckoutView, { title: string; body: string }> = {
  paid: {
    title: "Pembayaran berhasil",
    body: "Pembayaran sudah diterima. Sesi tes aktif dan siap dibagikan.",
  },
  verifying: {
    title: "Pembayaran diterima — sedang diverifikasi",
    body: "Pembayaran sudah tercatat di penyedia pembayaran. Sistem sedang memperbarui tagihan; halaman ini menyegarkan sendiri.",
  },
  waiting: {
    title: "Menunggu pembayaran",
    body: "Pembayaran belum masuk. Selesaikan pembayaran, lalu halaman ini akan diperbarui otomatis.",
  },
  failed: {
    title: "Pembayaran tidak berhasil",
    body: "Pembayaran tidak selesai atau sudah kedaluwarsa. Silakan mulai lagi.",
  },
};

/** Resolves the DB status (+ Snap hint) into the four states a buyer can see. */
export function resolveCheckoutView(checkout: CheckoutStatusResult, hint?: string): CheckoutView {
  if (checkout.status === "PAID") return "paid";
  if (checkout.status === "CANCELLED" || checkout.status === "EXPIRED") return "failed";
  const settled = hint !== undefined && (SETTLED_HINTS as readonly string[]).includes(hint);
  return settled ? "verifying" : "waiting";
}

export function primaryCheckoutAction(
  checkout: CheckoutStatusResult,
  view: CheckoutView,
): PrimaryAction {
  if (view === "paid") {
    if (checkout.kind === "invoice") {
      return {
        kind: "link",
        href: checkout.sessionId ? `/instansi/sesi/${checkout.sessionId}` : "/instansi/sesi",
        label: "Isi peserta sekarang",
      };
    }
    return { kind: "link", href: "/dashboard", label: "Mulai tes" };
  }
  if (view === "verifying") return { kind: "reconcile", label: "Cek status sekarang" };
  if (view === "waiting" && checkout.kind === "invoice") {
    return { kind: "link", href: `/instansi/tagihan/${checkout.id}`, label: "Lihat tagihan" };
  }
  if (view === "failed") return { kind: "link", href: "/tes", label: "Mulai lagi" };
  return { kind: "link", href: "/dashboard", label: "Ke dashboard" };
}
