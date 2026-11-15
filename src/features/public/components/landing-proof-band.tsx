import type { PublicStats } from "@/lib/api/types";

/**
 * The landing page's proof band. Every number is counted from the database —
 * no "1000+ pengguna" that nobody measured. When the catalog is empty the band
 * renders nothing rather than three zeroes.
 */
export function LandingProofBand({ stats }: { stats: PublicStats | null }) {
  if (!stats || stats.tests === 0) return null;

  const items = [
    { value: stats.tests, label: "Tes tersedia" },
    { value: stats.categories, label: "Kategori" },
    { value: stats.psychologists, label: "Psikolog berlisensi" },
  ];

  return (
    <section aria-label="Ringkasan katalog" className="bg-background border-t">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-3 px-4 py-10 sm:px-6 sm:py-12">
        {items.map((item, index) => (
          <div key={item.label} className={`text-center ${index > 0 ? "border-l" : ""}`}>
            <p className="text-3xl font-semibold tabular-nums sm:text-4xl">{item.value}</p>
            <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
