const STEPS = [
  { title: "Mulai tes", body: "Pilih tes ini dan selesaikan pembayarannya dengan aman." },
  { title: "Kerjakan online", body: "Akses tes dari dasbor dan jawab sesuai waktu yang tersedia." },
  {
    title: "Terima hasil",
    body: "Hasil diverifikasi psikolog dan dapat diunduh sebagai laporan dengan QR verifikasi.",
  },
] as const;

/** "Cara Kerja" — three numbered cards. */
export function TestSteps() {
  return (
    <section aria-labelledby="cara-kerja" className="space-y-4">
      <h2 id="cara-kerja" className="text-lg font-semibold">
        Cara Kerja
      </h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="bg-card rounded-2xl border p-5">
            <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-sm font-semibold">
              {index + 1}
            </span>
            <p className="mt-3 font-medium">{step.title}</p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
