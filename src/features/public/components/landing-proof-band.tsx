import { BookOpen, Layers, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PublicStats } from "@/lib/api/types";

/**
 * The landing page's proof band. Every number is counted from the database —
 * no "1000+ pengguna" that nobody measured. When the catalog is empty the band
 * renders nothing rather than three zeroes.
 */
export function LandingProofBand({ stats }: { stats: PublicStats | null }) {
  if (!stats || stats.tests === 0) return null;

  const items: { icon: LucideIcon; value: number; label: string }[] = [
    { icon: BookOpen, value: stats.tests, label: "Tes tersedia" },
    { icon: Layers, value: stats.categories, label: "Kategori" },
    { icon: Stethoscope, value: stats.psychologists, label: "Psikolog berlisensi" },
  ];

  return (
    <section aria-label="Ringkasan layanan" className="bg-background border-t">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-3 divide-x px-4 py-10 sm:px-6 sm:py-12">
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 px-4 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Icon className="size-5 text-primary" aria-hidden />
            </span>
            <p className="text-3xl font-bold tabular-nums sm:text-4xl">{value}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
