import { describe, expect, it } from "vitest";
import {
  ArticleFormSchema,
  buildArticlePayload,
  emptyArticleForm,
  slugify,
  toArticleFormDefaults,
} from "@/features/admin/articles/schemas";
import type { AdminArticle } from "@/lib/api/types";

const valid = {
  title: "Mengelola Stres Kerja",
  slug: "mengelola-stres-kerja",
  excerpt: "Panduan singkat mengelola stres di tempat kerja.",
  category: "Kesehatan Mental",
  content: [{ type: "paragraph" as const, text: "Isi artikel." }],
};

describe("ArticleFormSchema", () => {
  it("accepts a valid article", () => {
    expect(ArticleFormSchema.safeParse(valid).success).toBe(true);
  });

  it("treats an empty category as optional", () => {
    expect(ArticleFormSchema.safeParse({ ...valid, category: "" }).success).toBe(true);
  });

  it("rejects a short title, short excerpt and invalid slug", () => {
    expect(ArticleFormSchema.safeParse({ ...valid, title: "ab" }).success).toBe(false);
    expect(ArticleFormSchema.safeParse({ ...valid, excerpt: "pendek" }).success).toBe(false);
    expect(ArticleFormSchema.safeParse({ ...valid, slug: "Slug Salah!" }).success).toBe(false);
  });

  it("requires at least one content block", () => {
    expect(ArticleFormSchema.safeParse({ ...valid, content: [] }).success).toBe(false);
  });

  it("rejects an image block that points outside the served media path", () => {
    const result = ArticleFormSchema.safeParse({
      ...valid,
      content: [{ type: "image", url: "https://evil.example/x.png" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a locally-served image block", () => {
    const result = ArticleFormSchema.safeParse({
      ...valid,
      content: [
        { type: "image", url: "/api/v1/articles/media/0f8fad5b-d9cb-469f-a165-70867728950e.png" },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("buildArticlePayload", () => {
  it("trims fields and drops an empty category", () => {
    expect(
      buildArticlePayload({ ...valid, title: "  Judul  ", category: "  " }),
    ).toEqual({
      title: "Judul",
      slug: "mengelola-stres-kerja",
      excerpt: valid.excerpt,
      category: undefined,
      content: valid.content,
    });
  });
});

describe("slugify", () => {
  it("produces a URL-safe slug from a title", () => {
    expect(slugify("Mengelola Stres Kerja: Tips & Trik")).toBe("mengelola-stres-kerja-tips-trik");
  });
});

describe("toArticleFormDefaults", () => {
  it("maps a null category to an empty string", () => {
    const article = {
      ...valid,
      id: "a1",
      coverUrl: null,
      category: null,
      status: "DRAFT",
      publishedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    } satisfies AdminArticle;
    expect(toArticleFormDefaults(article).category).toBe("");
    expect(toArticleFormDefaults(article).slug).toBe("mengelola-stres-kerja");
  });
});

describe("emptyArticleForm", () => {
  it("starts with a single empty paragraph", () => {
    expect(emptyArticleForm().content).toEqual([{ type: "paragraph", text: "" }]);
  });
});
