import { ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "Berapa lama hasil keluar?",
    a: "Hasil diproses otomatis dan diverifikasi psikolog. Anda akan diberi tahu begitu laporan siap.",
  },
  {
    q: "Apakah hasilnya resmi?",
    a: "Ya. Setiap laporan ditandatangani psikolog berlisensi dan dilengkapi QR untuk memverifikasi keasliannya.",
  },
  {
    q: "Bisa dikerjakan lewat HP?",
    a: "Ya, tes dirancang responsif dan dapat dikerjakan dari ponsel maupun komputer.",
  },
  {
    q: "Bagaimana jika koneksi terputus?",
    a: "Jawaban tersimpan sepanjang pengerjaan, sehingga Anda bisa melanjutkan dari tempat terakhir.",
  },
] as const;

/** Native <details> accordion — works without JS, chevron rotates when open. */
export function TestFaq() {
  return (
    <section aria-labelledby="faq" className="space-y-4">
      <h2 id="faq" className="text-lg font-semibold">
        Pertanyaan Umum
      </h2>
      <div className="bg-card divide-y overflow-hidden rounded-2xl border">
        {FAQ.map((item) => (
          <details key={item.q} className="group">
            <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors marker:content-none">
              {item.q}
              <ChevronDown
                className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
