import { AlignLeft, BarChart3, FileBadge, QrCode } from "lucide-react";
import { TestReportPreview } from "./test-report-preview";

const CONTENTS = [
  {
    icon: FileBadge,
    title: "Identitas & nomor laporan",
    body: "Nomor unik, tanggal pemeriksaan, dan identitas peserta tercetak di halaman sampul.",
  },
  {
    icon: BarChart3,
    title: "Skor tiap aspek",
    body: "Setiap aspek dinilai pada skala R–K–C–B–T, jadi terlihat mana yang kuat dan mana yang perlu dilatih.",
  },
  {
    icon: AlignLeft,
    title: "Kesimpulan tertulis",
    body: "Psikolog menulis kesimpulan untuk setiap bagian, ditutup dengan saran pengembangan.",
  },
  {
    icon: QrCode,
    title: "Tanda tangan & QR",
    body: "Nama, gelar, dan nomor STR/SIK psikolog, plus QR yang bisa dipindai untuk verifikasi publik.",
  },
] as const;

/** "Apa yang Anda dapat" — the report preview plus what is inside it. */
export function TestReportContents() {
  return (
    <section aria-labelledby="isi-laporan" className="space-y-4">
      <div className="space-y-1">
        <h2 id="isi-laporan" className="text-lg font-semibold">
          Apa yang Anda dapat
        </h2>
        <p className="text-muted-foreground text-sm">
          Satu laporan PDF yang bisa diunduh kapan saja — bukan sekadar angka di layar.
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border p-5 sm:grid-cols-[minmax(0,250px)_1fr] sm:items-center sm:p-6">
        <TestReportPreview />

        <ul className="grid content-start gap-x-6 gap-y-7 sm:grid-cols-2">
          {CONTENTS.map(({ icon: Icon, title, body }) => (
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
    </section>
  );
}
