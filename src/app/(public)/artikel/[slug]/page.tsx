import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { isApiError } from "@/lib/api/client";
import { formatIdDate } from "@/lib/format/format-date";
import { fetchPublicArticleServer, fetchPublicArticlesServer } from "@/features/public/api";
import { ArticleBlocks } from "@/features/public/components/article-blocks";

export async function generateMetadata({ params }: PageProps<"/artikel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await fetchPublicArticleServer(slug);
    return { title: data.title, description: data.excerpt };
  } catch {
    return { title: "Artikel tidak ditemukan" };
  }
}

export default async function ArtikelDetailPage({ params }: PageProps<"/artikel/[slug]">) {
  const { slug } = await params;

  let article;
  try {
    article = (await fetchPublicArticleServer(slug)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const related = await fetchPublicArticlesServer({ limit: 100, category: article.category ?? undefined })
    .then((res) => res.data)
    .catch(() => []);

  const relatedArticles = related.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-16 sm:px-6">
      <Link
        href="/artikel"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Semua Artikel
      </Link>

      {article.coverUrl ? (
        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverUrl} alt="" className="size-full object-cover" />
        </div>
      ) : null}

      <header className="mt-6 space-y-3">
        {article.category ? <Badge className="w-fit bg-primary/10 text-primary">{article.category}</Badge> : null}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{article.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden />
          {formatIdDate(article.publishedAt)}
        </p>
        <p className="text-muted-foreground">{article.excerpt}</p>
      </header>

      <Separator className="my-6" />

      <ArticleBlocks blocks={article.content} />

      {relatedArticles.length > 0 ? (
        <section className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold">Artikel Terkait</h2>
          <div className="space-y-3">
            {relatedArticles.map((a) => (
              <Link key={a.id} href={`/artikel/${a.slug}`} className="group flex gap-4 rounded-2xl border bg-background p-4 transition-shadow hover:shadow-md">
                {a.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.coverUrl} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="size-20 shrink-0 rounded-xl bg-muted" />
                )}
                <div className="space-y-1">
                  <h3 className="font-semibold leading-snug group-hover:text-primary">{a.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
