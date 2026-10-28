import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicArticleListItem } from "@/lib/api/types";
import { ArticleCard } from "./article-card";

/** White band: the latest published articles. */
export function LandingArticlesBand({ articles }: { articles: PublicArticleListItem[] }) {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-14 sm:px-6 sm:py-16">
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
          {articles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border bg-background px-6 py-10 text-center text-sm text-muted-foreground">
              Belum ada artikel yang diterbitkan. Nantikan tulisan terbaru dari kami.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
