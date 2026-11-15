import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleCover } from "@/features/public/components/article-cover";
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
        <ArticleCover
          article={article}
          className="h-40 w-full shrink-0 overflow-hidden border-b"
        />
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            {/* Without a cover the band already prints the category. */}
            {article.coverUrl && article.category ? (
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
