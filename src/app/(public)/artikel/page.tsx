import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchPublicArticleCategories, fetchPublicArticlesServer } from "@/features/public/api.server";
import { ArticleCard } from "@/features/public/components/article-card";
import { ArticleCategoryFilters } from "@/features/public/components/article-category-filters";
import { ArticleSearchForm } from "@/features/public/components/article-search-form";
import { formatIdDate } from "@/lib/format/format-date";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Kebijaksanaan, tips, dan edukasi psikologi dari tim kami.",
};

const PAGE_SIZE = 12;

function parseSearch(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const q = first?.trim();
  return q ? q : undefined;
}

function parseCategory(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const c = first?.trim();
  return c ? c : undefined;
}

export default async function ArtikelPage({
  searchParams,
}: PageProps<"/artikel">) {
  const sp = await searchParams;
  const search = parseSearch(sp.search);
  const category = parseCategory(sp.category);
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);

  const categories = await fetchPublicArticleCategories();
  const result = await fetchPublicArticlesServer({
    limit: PAGE_SIZE,
    page,
    category,
    search,
  }).catch(() => null);
  const articles = result?.data ?? [];
  const meta = result?.meta;

  const featured = articles[0];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Newspaper className="size-4" aria-hidden />
          Artikel
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Artikel Psikologi</h1>
        <p className="max-w-2xl text-muted-foreground">
          Tips, kebijaksanaan, dan edukasi untuk kesehatan mental — ditulis bersama psikolog kami.
        </p>
      </header>

      <ArticleSearchForm category={category} />

      <ArticleCategoryFilters categories={categories.map((c) => ({ value: c, label: c }))} category={category} search={search} />

      {featured ? (
        <Link
          href={`/artikel/${featured.slug}`}
          className="group grid overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md md:grid-cols-2"
        >
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
            {featured.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverUrl} alt="" className="size-full object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="size-full bg-gradient-to-br from-primary/15 to-secondary" />
            )}
          </div>
          <div className="space-y-3 p-6">
            {featured.category ? <Badge className="w-fit bg-primary/10 text-primary">{featured.category}</Badge> : null}
            <h2 className="text-xl font-semibold leading-snug group-hover:text-primary">{featured.title}</h2>
            <p className="line-clamp-3 text-sm text-muted-foreground">{featured.excerpt}</p>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden />
              {formatIdDate(featured.publishedAt)}
            </span>
          </div>
        </Link>
      ) : null}

      {articles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border bg-background px-6 py-12 text-center text-sm text-muted-foreground">
          Tidak ada artikel yang cocok dengan kriteria pencarian Anda.
        </p>
      )}

      {meta && meta.totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-4" aria-label="Navigasi halaman">
          {page > 1 ? (
            <Link href={`/artikel?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`} className="text-sm font-medium text-primary hover:underline">
              Sebelumnya
            </Link>
          ) : null}
          <span className="text-sm text-muted-foreground">
            Halaman {meta.page} dari {meta.totalPages}
          </span>
          {page < meta.totalPages ? (
            <Link href={`/artikel?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`} className="text-sm font-medium text-primary hover:underline">
              Berikutnya
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
