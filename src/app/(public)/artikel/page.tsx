import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { fetchPublicArticleCategories, fetchPublicArticlesServer } from "@/features/public/api";
import { ArticleCard } from "@/features/public/components/article-card";
import { ArticleCategoryFilters } from "@/features/public/components/article-category-filters";
import { ArticleFeaturedCard } from "@/features/public/components/article-featured-card";
import { ArticlePagination } from "@/features/public/components/article-pagination";
import { ArticleSearchForm } from "@/features/public/components/article-search-form";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Panduan, tips, dan edukasi psikologi dari tim kami.",
};

const PAGE_SIZE = 12;

function firstValue(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();
  return trimmed ? trimmed : undefined;
}

export default async function ArtikelPage({ searchParams }: PageProps<"/artikel">) {
  const sp = await searchParams;
  const search = firstValue(sp.search);
  const category = firstValue(sp.category);
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
          Panduan, tips, dan edukasi psikologi — ditulis bersama psikolog kami.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <ArticleSearchForm category={category} search={search} />
        </div>
        <ArticleCategoryFilters
          categories={categories.map((c) => ({ value: c, label: c }))}
          category={category}
          search={search}
        />
      </div>

      {featured ? <ArticleFeaturedCard article={featured} /> : null}

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
        <ArticlePagination
          page={page}
          totalPages={meta.totalPages}
          category={category}
          search={search}
        />
      ) : null}
    </main>
  );
}
