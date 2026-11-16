// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TestCard } from "@/features/public/components/test-card";
import { ArticleCard } from "@/features/public/components/article-card";
import type { PublicTest, PublicArticleListItem } from "@/lib/api/types";

afterEach(cleanup);

const test: PublicTest = {
  id: "t1",
  slug: "disc",
  name: "Tes DISC",
  description: "Mengukur gaya kerja dan komunikasi.",
  imageUrl: null,
  category: "WORK_STYLE",
  price: 150000,
  estimatedDurationMin: 15,
  ageBand: null,
};

const article: PublicArticleListItem = {
  id: "a1",
  slug: "stres-kerja",
  title: "Mengelola Stres Kerja",
  excerpt: "Panduan singkat mengelola stres di tempat kerja.",
  coverUrl: null,
  category: "Kesehatan Mental",
  publishedAt: "2026-02-01T00:00:00.000Z",
};

describe("TestCard", () => {
  it("shows the name, category, duration and detail link", () => {
    render(<TestCard test={test} />);
    expect(screen.getByText("Tes DISC")).toBeTruthy();
    expect(screen.getByText("Gaya Kerja")).toBeTruthy();
    expect(screen.getByText("15 menit")).toBeTruthy();
    expect(screen.queryByText(/Rp\s?150\.000/)).toBeNull();
    expect(screen.getByRole("link", { name: /Detail/ }).getAttribute("href")).toBe("/tes/disc");
  });

  it("renders an injected buy action", () => {
    render(<TestCard test={test} buySlot={<button type="button">Beli</button>} />);
    expect(screen.getByRole("button", { name: "Beli" })).toBeTruthy();
  });

  it("shows the cover when the test has one", () => {
    render(<TestCard test={{ ...test, imageUrl: "/uploads/test-covers/disc.png" }} />);

    const cover = screen.getByRole("img", { name: "Tes DISC" });
    expect(cover.getAttribute("src")).toContain("test-covers");
  });

  it("replaces the empty media strip with the category band", () => {
    render(<TestCard test={test} />);

    expect(screen.queryByRole("img", { name: "Tes DISC" })).toBeNull();
    expect(screen.getByTestId("category-band")).toBeTruthy();
  });
});

describe("ArticleCard", () => {
  it("shows the title, excerpt and links to the article", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("Mengelola Stres Kerja")).toBeTruthy();
    expect(screen.getByText(article.excerpt)).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("href")).toBe("/artikel/stres-kerja");
  });

  it("prints the category on the band when the article has no cover", () => {
    render(<ArticleCard article={article} />);

    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByTestId("article-cover-fallback")).toBeTruthy();
    // The band carries the category, so the badge below would repeat it.
    expect(screen.getAllByText("Kesehatan Mental")).toHaveLength(1);
  });

  it("shows the cover and the category badge when the article has a cover", () => {
    render(<ArticleCard article={{ ...article, coverUrl: "/uploads/covers/stres.jpg" }} />);

    expect(screen.queryByTestId("article-cover-fallback")).toBeNull();
    expect(screen.getByText("Kesehatan Mental")).toBeTruthy();
  });
});
