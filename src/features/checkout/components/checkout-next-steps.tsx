import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CheckoutStatusResult } from "@/lib/api/types";
import type { TimelineStep } from "@/features/public/components/step-timeline";
import { StepTimeline } from "@/features/public/components/step-timeline";
import type { CheckoutView } from "../checkout-result-view";

const WAITING_ORDER: TimelineStep[] = [
  {
    title: "Selesaikan pembayaran",
    body: "Ikuti instruksi di halaman pembayaran sebelum batas waktu.",
  },
  {
    title: "Tunggu konfirmasi",
    body: "Status diperbarui otomatis setelah penyedia mengonfirmasi pembayaran.",
  },
  {
    title: "Mulai tes",
    body: "Setelah lunas, buka dashboard dan mulai dari kartu tes yang aktif.",
  },
];

const WAITING_INVOICE: TimelineStep[] = [
  {
    title: "Selesaikan pembayaran",
    body: "Bayar invoice sebelum batas waktu yang tampil di halaman tagihan.",
  },
  {
    title: "Sesi aktif",
    body: "Sesi instansi aktif setelah pembayaran terkonfirmasi.",
  },
  {
    title: "Isi peserta",
    body: "Buka sesi untuk menambah peserta atau membagikan link/PIN.",
  },
];

const PAID_ORDER: TimelineStep[] = [
  { title: "Buka dashboard", body: "Masuk ke akun Anda." },
  { title: "Mulai tes", body: "Tes sudah aktif; kerjakan dari dashboard." },
  { title: "Tunggu review", body: "Psikolog memeriksa hasil sebelum dirilis." },
  {
    title: "Unduh hasil",
    body: "Hasil muncul setelah disetujui; sertifikat menyusul bila diterbitkan.",
  },
];

const PAID_INVOICE: TimelineStep[] = [
  { title: "Buka sesi", body: "Buka sesi instansi di dashboard." },
  { title: "Isi peserta", body: "Tambahkan nama atau bagikan link/PIN." },
  { title: "Pantau progres", body: "Lihat status tiap peserta di dashboard." },
  {
    title: "Unduh laporan",
    body: "Laporan dan sertifikat tersedia setelah psikolog menyetujui.",
  },
];

const FAILED: TimelineStep[] = [
  { title: "Kembali ke katalog", body: "Pilih tes yang ingin dikerjakan." },
  { title: "Buat pesanan baru", body: "Pesanan lama sudah tidak bisa dibayar." },
];

function stepsFor(kind: CheckoutStatusResult["kind"], view: CheckoutView): TimelineStep[] {
  if (view === "paid") return kind === "invoice" ? PAID_INVOICE : PAID_ORDER;
  if (view === "waiting") return kind === "invoice" ? WAITING_INVOICE : WAITING_ORDER;
  if (view === "failed") return FAILED;
  // verifying: the payment exists, the record is catching up.
  return [
    { title: "Tunggu verifikasi", body: "Penyedia sudah menerima pembayaran." },
    { title: "Cek status", body: "Gunakan tombol Cek status sekarang di atas." },
    {
      title: "Lanjutkan",
      body:
        kind === "invoice" ? "Isi peserta setelah sesi aktif." : "Mulai tes setelah status lunas.",
    },
  ];
}

/** What to do after the payment page, per flow and per status. */
export function CheckoutNextSteps({
  kind,
  view,
}: {
  kind: CheckoutStatusResult["kind"];
  view: CheckoutView;
}) {
  return (
    <section className="mt-6 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-semibold">Langkah berikutnya</h2>
        <Link
          href="/bantuan#pembayaran"
          className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Panduan pembayaran
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <StepTimeline steps={stepsFor(kind, view)} columns={2} />
      <p className="text-muted-foreground text-sm">
        Sudah membayar tetapi status belum berubah? Coba cek status sekali lagi. Saat menghubungi
        admin, sertakan ID pesanan, nominal, dan waktu pembayaran.
      </p>
    </section>
  );
}
