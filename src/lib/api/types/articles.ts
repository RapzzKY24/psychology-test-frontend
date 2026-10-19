/**
 * Article types — mirror docs/superpowers/specs/2026-10-18-public-pages-artikel-design.md
 * and the BE module src/modules/articles (dto/article.dto.ts + article-block.dto.ts).
 */

export type ArticleStatus = "DRAFT" | "PUBLISHED";

/** Structured rich-text block — never raw HTML (safe render, no XSS). */
export interface ArticleHeadingBlock {
  type: "heading";
  text: string;
}

export interface ArticleParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ArticleListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}

export interface ArticleImageBlock {
  type: "image";
  /** Served by the articles module: `/api/v1/articles/media/<uuid>.(png|jpg)`. */
  url: string;
  caption?: string;
}

export type ArticleBlock =
  | ArticleHeadingBlock
  | ArticleParagraphBlock
  | ArticleListBlock
  | ArticleImageBlock;

/** Row of `GET /api/v1/admin/articles` — list omits the rich-text body. */
export interface AdminArticleListItem {
  /** FE-only: set while an optimistic mutation is in flight (rendered grayed). */
  _optimistic?: boolean;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  category: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Detail of `GET /api/v1/admin/articles/:id` — includes the blocks. */
export interface AdminArticle extends Omit<AdminArticleListItem, "content"> {
  content: ArticleBlock[];
}

/** Body of `POST`/`PATCH /api/v1/admin/articles`. */
export interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  content: ArticleBlock[];
}

/** Row of `GET /api/v1/articles` (public, published only). */
export interface PublicArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  category: string | null;
  publishedAt: string | null;
}

/** Detail of `GET /api/v1/articles/:slug` (public, published only). */
export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  content: ArticleBlock[];
  category: string | null;
  publishedAt: string | null;
}
