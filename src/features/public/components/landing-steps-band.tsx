import { FileCheck, Monitor, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: { step: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    step: "01",
    icon: Search,
    title: "Pilih Tes yang Sesuai",
    description:
      "Pilih tes yang sesuai kebutuhanmu — kepribadian, kognitif, gaya kerja, dan lainnya.",
  },
  {
    step: "02",
    icon: Monitor,
    title: "Kerjakan Secara Online",
    description:
      "Ikuti tes langsung di platform kami kapan saja dan di mana saja. Tidak perlu instalasi.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Terima Hasil Resmi",
    description:
      "Hasil diverifikasi psikolog berlisensi dan tersedia sebagai laporan resmi yang dapat dipercaya.",
  },
];

/** How-it-works band. Cards on gray, white background per card creates depth. */
export function LandingStepsBand() {
  return (
    <section className="bg-muted/40 border-y">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Cara kerjanya</h2>
          <p className="text-muted-foreground mt-1.5 max-w-lg text-sm sm:text-base">
            Dari pilih tes hingga terima hasil — semua selesai di satu platform.
          </p>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ step, icon: Icon, title, description }) => (
            <li key={step} className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" strokeWidth={1.5} aria-hidden />
                </div>
                <span className="font-mono text-5xl font-bold leading-none text-muted-foreground/15 select-none">
                  {step}
                </span>
              </div>
              <h3 className="font-semibold leading-snug">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
