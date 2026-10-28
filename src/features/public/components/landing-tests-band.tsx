import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEST_CATEGORIES, TEST_CATEGORY_LABELS } from "@/lib/api/types";
import type { PublicTest } from "@/lib/api/types";
import { TestCard } from "./test-card";

/** Gray band: category pills plus the first three published tests. */
export function LandingTestsBand({ tests }: { tests: PublicTest[] }) {
  return (
    <section className="bg-muted/50 border-y">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-14 sm:px-6 sm:py-16">
        <section>
          <div className="flex flex-wrap gap-2">
            {TEST_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/tes?category=${category}`}
                className="rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {TEST_CATEGORY_LABELS[category]}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Tes Populer</h2>
            <Link
              href="/tes"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat semua
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {tests.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border bg-background px-6 py-10 text-center text-sm text-muted-foreground">
              Belum ada tes yang tersedia saat ini. Silakan kembali lagi nanti.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
