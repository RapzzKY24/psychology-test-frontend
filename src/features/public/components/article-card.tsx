import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicArticleListItem } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

/**
 * Public article card (cover + category + title + excerpt). Shared by the
 * landing preview and the /artikel list.
 */
export function ArticleCard({ article }: { article: PublicArticleListItem }) {
  return (
    <Link href={`/artikel/${article.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl pt-0 shadow-sm transition-shadow group-hover:shadow-md">
        {/* Fixed strip: a cover image never changes the card's height. */}
        <div className="h-40 w-full overflow-hidden bg-muted">
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
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            {article.category ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {article.category}
              </Badge>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {formatIdDate(article.publishedAt)}
            </span>
          </div>
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
            {article.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
