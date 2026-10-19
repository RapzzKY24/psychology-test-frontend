import Link from "next/link";
import { ArrowRight, BadgeCheck, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEST_CATEGORIES, TEST_CATEGORY_LABELS } from "@/lib/api/types";
import { fetchPublicArticlesServer, fetchPublicTestsServer } from "@/features/public/api.server";
import { ArticleCard } from "@/features/public/components/article-card";
import { TestCard } from "@/features/public/components/test-card";

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Psikolog berlisensi" },
  { icon: QrCode, label: "Hasil terverifikasi QR" },
  { icon: ShieldCheck, label: "Data Anda aman" },
] as const;

export default async function LandingPage() {
  const [tests, articles] = await Promise.all([
    fetchPublicTestsServer({ limit: 3 }).catch(() => null),
    fetchPublicArticlesServer({ limit: 3 }).catch(() => null),
  ]);

  const popularTests = tests?.data ?? [];
  const latestArticles = articles?.data ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero */}
      <section className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <BadgeCheck className="size-4" aria-hidden />
          Tes psikologi berlisensi
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Kenali dirimu lewat tes psikologi yang terpercaya
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Kerjakan tes online, dapatkan hasil yang diverifikasi psikolog, dan unduh laporan resmi
          yang dapat dipercaya.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/tes">Lihat Tes</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/untuk-perusahaan">Untuk Perusahaan</Link>
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map((badge) => (
            <li key={badge.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <badge.icon className="size-4 text-primary" aria-hidden />
              {badge.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Category strip */}
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

      {/* Popular tests */}
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
        {popularTests.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border bg-background px-6 py-10 text-center text-sm text-muted-foreground">
            Belum ada tes yang tersedia saat ini. Silakan kembali lagi nanti.
          </p>
        )}
      </section>

      {/* Latest articles */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Artikel Terbaru</h2>
          <Link
            href="/artikel"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {latestArticles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border bg-background px-6 py-10 text-center text-sm text-muted-foreground">
            Belum ada artikel yang diterbitkan. Nantikan tulisan terbaru dari kami.
          </p>
        )}
      </section>

      {/* B2B */}
      <section>
        <Card className="overflow-hidden rounded-2xl border-none bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Tes untuk tim & perusahaan
              </h2>
              <p className="max-w-xl text-sm text-primary-foreground/90">
                Beli slot terlebih dahulu, lalu isi nama peserta kapan saja. Cocok untuk rekrutmen
                maupun pemetaan karyawan.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shrink-0 rounded-full">
              <Link href="/untuk-perusahaan">Pelajari Paket Instansi</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
