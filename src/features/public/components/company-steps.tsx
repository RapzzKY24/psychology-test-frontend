import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { title: "Daftar instansi", body: "Isi data instansi dan akun akuntabilitas (PIC HR)." },
  { title: "Pilih paket & beli slot", body: "Pilih paket sesuai jumlah peserta & durasi." },
  { title: "Daftarkan peserta", body: "Masukkan data peserta; admin bisa mengirim undangan." },
  { title: "Terima hasil", body: "Bagi hasil per orang atau kelompok, verifikasi psikolog." },
];

/** The four steps of the institution package, numbered in order. */
export function CompanySteps() {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">Alur Paket Instansi</h2>
      <ol className="space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        Kembali ke beranda
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
