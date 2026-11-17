import { Award, BarChart3, FileText, Monitor, QrCode, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PublicTest, UserRole } from "@/lib/api/types";
import { deliverableFlowFor } from "../deliverables";
import { PUBLIC_COPY } from "../copy";
import { TestReportPreview } from "./test-report-preview";

interface Deliverable {
  icon: LucideIcon;
  title: string;
  body: string;
}

const PERSONAL: Deliverable[] = [
  {
    icon: BarChart3,
    title: "Halaman hasil",
    body: "Skor dan interpretasi muncul di dashboard setelah psikolog menyetujui.",
  },
  {
    icon: Award,
    title: "Sertifikat 1 halaman",
    body: "Diterbitkan psikolog setelah hasil disetujui; berisi nomor, QR, dan tanda tangan.",
  },
  {
    icon: QrCode,
    title: "Verifikasi publik",
    body: "QR pada sertifikat membuka halaman verifikasi tanpa menampilkan skor.",
  },
];

const INSTANSI: Deliverable[] = [
  {
    icon: FileText,
    title: "Laporan 4 halaman per peserta",
    body: "Berisi penilaian psikolog dan rekomendasi; diunduh dari dashboard instansi.",
  },
  {
    icon: Award,
    title: "Sertifikat 1 halaman",
    body: "Tersedia untuk tes non-WPT setelah psikolog menerbitkannya.",
  },
  {
    icon: Monitor,
    title: "Pantauan progres",
    body: "Status tiap peserta dan hasil yang sudah disetujui dalam satu dashboard.",
  },
];

const WPT: Deliverable[] = [
  {
    icon: FileText,
    title: "Laporan CPMI 4 halaman",
    body: "WPT punya dokumen sendiri; tidak menerbitkan sertifikat umum.",
  },
  {
    icon: QrCode,
    title: "Verifikasi QR",
    body: "Dokumen dapat diperiksa keasliannya lewat kode yang tercetak di dokumen.",
  },
  {
    icon: ShieldCheck,
    title: "Review psikolog",
    body: "Hasil diperiksa dan disetujui sebelum dokumen diterbitkan.",
  },
];

const BARS = [
  { label: "Aspek A", value: 78 },
  { label: "Aspek B", value: 64 },
  { label: "Aspek C", value: 52 },
] as const;

/** A miniature web result — markup, not a screenshot, so it follows the theme. */
function ResultPreview() {
  return (
    <figure className="space-y-2">
      <div aria-hidden className="bg-card ring-foreground/5 rounded-md border p-4 shadow-sm ring-1">
        <div className="text-muted-foreground flex items-center justify-between text-[8px] font-semibold tracking-wider uppercase">
          <span>mypsikolog.id</span>
          <span>Hasil</span>
        </div>
        <p className="mt-3 text-sm font-semibold">Hasil Pemeriksaan</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[8px] font-medium">
            Disetujui
          </span>
          <span className="text-muted-foreground text-[8px]">Psikolog berlisensi</span>
        </div>
        <div className="mt-3 space-y-2">
          {BARS.map((bar) => (
            <div key={bar.label}>
              <div className="text-muted-foreground flex justify-between text-[8px]">
                <span>{bar.label}</span>
                <span>{bar.value}</span>
              </div>
              <div className="bg-muted mt-1 h-1.5 rounded-full">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground mt-3 flex items-center justify-between border-t pt-2 text-[8px]">
          <span>Interpretasi ditulis psikolog</span>
          <QrCode className="size-5" />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-center text-xs">
        Contoh halaman hasil — angka disamarkan.
      </figcaption>
    </figure>
  );
}

/** "Apa yang Anda terima", adapted to the buyer's path and the test's document. */
export function TestDeliverables({ test, role }: { test: PublicTest; role: UserRole | null }) {
  const flow = deliverableFlowFor(test, role);
  const items = flow === "wpt" ? WPT : flow === "instansi" ? INSTANSI : PERSONAL;
  const showReportPreview = flow !== "personal";
  const note =
    flow === "wpt"
      ? "WPT/CPMI memakai laporan sendiri dan tidak menerbitkan sertifikat umum."
      : flow === "instansi"
        ? "Sertifikat selalu diterbitkan psikolog setelah hasil disetujui; WPT/CPMI tidak menerbitkan sertifikat umum."
        : "Laporan 4 halaman bukan bagian dari pembelian personal — laporan itu untuk peserta sesi instansi.";

  return (
    <section aria-labelledby="deliverables" className="space-y-4">
      <div className="space-y-1">
        <h2 id="deliverables" className="text-lg font-semibold">
          {PUBLIC_COPY.testDetail.deliverablesTitle}
        </h2>
        <p className="text-muted-foreground text-sm">
          Dokumen mengikuti jalur Anda: personal dan instansi tidak menerima dokumen yang sama.
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border p-5 sm:grid-cols-[minmax(0,250px)_1fr] sm:items-center sm:p-6">
        {showReportPreview ? <TestReportPreview /> : <ResultPreview />}

        <ul className="grid content-start gap-x-6 gap-y-7 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title} className="space-y-1.5">
              <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="pt-1 text-sm font-medium">{title}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground text-sm">{note}</p>
    </section>
  );
}
