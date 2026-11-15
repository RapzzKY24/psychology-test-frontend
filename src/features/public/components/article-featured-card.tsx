import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicArticleListItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

/** The lead article of the list: a wide card with the cover beside the text. */
export function ArticleFeaturedCard({ article }: { article: PublicArticleListItem }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group grid overflow-hidden rounded-2xl border bg-background shadow-sm transition-shadow hover:shadow-md md:grid-cols-2"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
        {article.coverUrl ? (
          // Local upload URL — next/image processing is unnecessary here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverUrl}
            alt=""
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-primary/15 to-secondary" />
        )}
      </div>
      <div className="space-y-3 p-6">
        {article.category ? (
          <Badge className="w-fit bg-primary/10 text-primary">{article.category}</Badge>
        ) : null}
        <h2 className="text-xl font-semibold leading-snug group-hover:text-primary">
          {article.title}
        </h2>
        <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatIdDate(article.publishedAt)}
        </span>
      </div>
    </Link>
  );
}
