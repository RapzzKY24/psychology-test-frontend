import { z } from "zod";
import type { AdminArticle, ArticleInput } from "@/lib/api/types";

/**
 * Mirrors the BE module src/modules/articles/dto (Zod v4 discriminated union).
 * The form validates blocks client-side so admins get inline feedback; the
 * backend re-validates and is the source of truth.
 */

export const ArticleHeadingBlockSchema = z.object({
  type: z.literal("heading"),
  text: z.string().trim().min(1, "Judul bagian wajib diisi.").max(200, "Maksimal 200 karakter."),
});

export const ArticleParagraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().trim().min(1, "Paragraf wajib diisi.").max(5000, "Maksimal 5000 karakter."),
});

export const ArticleListBlockSchema = z.object({
  type: z.literal("list"),
  ordered: z.boolean(),
  items: z
    .array(z.string().trim().min(1, "Poin tidak boleh kosong.").max(1000))
    .min(1, "Tambahkan minimal satu poin.")
    .max(50, "Maksimal 50 poin."),
});

export const ArticleImageBlockSchema = z.object({
  type: z.literal("image"),
  // Must be a locally-served article media URL — never an external/JS URL.
  url: z
    .string()
    .regex(
      /^\/api\/v1\/articles\/media\/[a-f0-9-]+\.(png|jpg)$/,
      "Unggah gambar terlebih dahulu.",
    ),
  caption: z.string().trim().max(300, "Maksimal 300 karakter.").optional(),
});

export const ArticleBlockSchema = z.discriminatedUnion("type", [
  ArticleHeadingBlockSchema,
  ArticleParagraphBlockSchema,
  ArticleListBlockSchema,
  ArticleImageBlockSchema,
]);

export const ArticleFormSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter.").max(200, "Maksimal 200 karakter."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter.")
    .max(200, "Maksimal 200 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  excerpt: z
    .string()
    .trim()
    .min(10, "Ringkasan minimal 10 karakter.")
    .max(500, "Maksimal 500 karakter."),
  category: z.string().trim().max(50, "Maksimal 50 karakter.").optional().or(z.literal("")),
  content: z.array(ArticleBlockSchema).min(1, "Tambahkan minimal satu blok isi."),
});

export type ArticleFormInput = z.infer<typeof ArticleFormSchema>;
export type ArticleBlockInput = z.infer<typeof ArticleBlockSchema>;

/** Turn validated form values into the API payload (trim + drop empty category). */
export function buildArticlePayload(values: ArticleFormInput): ArticleInput {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim(),
    category: values.category?.trim() ? values.category.trim() : undefined,
    content: values.content,
  };
}

/** Title → URL-safe slug (admin convenience, still editable). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

/** Detail (with content) → form defaults. */
export function toArticleFormDefaults(article: AdminArticle): ArticleFormInput {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category ?? "",
    content: article.content,
  };
}

/** Empty defaults for the create dialog. */
export function emptyArticleForm(): ArticleFormInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    content: [{ type: "paragraph", text: "" }],
  };
}
