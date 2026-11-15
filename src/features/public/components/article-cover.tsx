import { Newspaper } from "lucide-react";
import type { PublicArticleListItem } from "@/lib/api/types";

/**
 * The cover strip of an article card.
 *
 * Most articles have no image yet. Instead of an empty box or a gradient, the
 * strip becomes a typographic cover: the category on a flat tint. The caller
 * owns the size, so the same strip serves the grid card (h-40) and the wide
 * featured card (16/9).
 */
export function ArticleCover({
  article,
  className,
  size = "sm",
}: {
  article: PublicArticleListItem;
  className?: string;
  /** "lg" is for the wide featured card, whose strip is several times taller. */
  size?: "sm" | "lg";
}) {
  if (article.coverUrl) {
    return (
      <div className={className}>
        {/* Local upload URL — next/image processing is unnecessary here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverUrl}
          alt=""
          className="size-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
    );
  }

  const lg = size === "lg";

  return (
    <div
      data-testid="article-cover-fallback"
      className={`flex flex-col items-center justify-center gap-3 bg-primary/5 ${className ?? ""}`}
    >
      <span
        className={`flex items-center justify-center rounded-full border border-primary/15 bg-background text-primary/70 shadow-sm ${
          lg ? "size-16" : "size-12"
        }`}
      >
        <Newspaper className={lg ? "size-7" : "size-5"} strokeWidth={1.5} aria-hidden />
      </span>
      {article.category ? (
        <span
          className={`px-4 text-center font-semibold tracking-[0.16em] text-primary/70 uppercase ${
            lg ? "text-xs" : "text-[11px]"
          }`}
        >
          {article.category}
        </span>
      ) : null}
    </div>
  );
}
