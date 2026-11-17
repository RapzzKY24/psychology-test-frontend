import type { Metadata } from "next";
import Link from "next/link";
import { Check, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEST_CATEGORIES, type TestCategory } from "@/lib/api/types";
import { fetchPublicTestsServer } from "@/features/public/api";
import { PUBLIC_COPY } from "@/features/public/copy";
import { TestBuyCta } from "@/features/public/components/test-buy-cta";
import { TestCard } from "@/features/public/components/test-card";
import { TestCategoryFilters } from "@/features/public/components/test-category-filters";
import { TestPagination } from "@/features/public/components/test-pagination";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Tes Psikologi",
  description: "Pilih tes psikologi yang sesuai kebutuhan Anda.",
};

const PAGE_SIZE = 12;

function parseCategory(value: string | string[] | undefined): TestCategory | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first && (TEST_CATEGORIES as readonly string[]).includes(first)
    ? (first as TestCategory)
    : undefined;
}

export default async function TesCatalogPage({ searchParams }: PageProps<"/tes">) {
  const sp = await searchParams;
  const category = parseCategory(sp.category);
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);

  const role = (await getServerSession())?.user?.role ?? null;

  const result = await fetchPublicTestsServer({ limit: PAGE_SIZE, page, category }).catch(
    () => null,
  );

  const tests = result?.data ?? [];
  const meta = result?.meta;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {PUBLIC_COPY.catalog.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{PUBLIC_COPY.catalog.description}</p>
        </div>
        {meta ? (
          <p className="text-muted-foreground pb-1 text-sm">
            <span className="text-foreground font-medium tabular-nums">{meta.total}</span> tes
            tersedia
          </p>
        ) : null}
      </header>

      <section className="bg-muted/30 grid gap-4 rounded-2xl border p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="text-sm font-semibold">{PUBLIC_COPY.catalog.introTitle}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{PUBLIC_COPY.catalog.introBody}</p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
            {PUBLIC_COPY.catalog.introPoints.map((point) => (
              <li key={point} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                <Check className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/bantuan#alur-personal">{PUBLIC_COPY.catalog.helpLink}</Link>
        </Button>
      </section>

      <TestCategoryFilters category={category} />

      {tests.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              buySlot={
                <TestBuyCta
                  testId={test.id}
                  testName={test.name}
                  testSlug={test.slug}
                  role={role}
                  className="flex-1"
                />
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-background px-6 py-16 text-center">
          <SearchX className="text-muted-foreground size-8" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium">Belum ada tes pada kategori ini</p>
            <p className="text-muted-foreground text-sm">
              Coba pilih kategori lain, atau lihat semua tes.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/tes">Lihat semua tes</Link>
          </Button>
        </div>
      )}

      {meta && meta.totalPages > 1 ? (
        <TestPagination page={page} totalPages={meta.totalPages} category={category} />
      ) : null}
    </main>
  );
}
