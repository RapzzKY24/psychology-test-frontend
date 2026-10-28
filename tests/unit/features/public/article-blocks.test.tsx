// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ArticleBlocks } from "@/features/public/components/article-blocks";
import type { ArticleBlock } from "@/lib/api/types/articles";

afterEach(() => cleanup());

describe("ArticleBlocks", () => {
  it("renders an ordered list as <ol>", () => {
    const blocks: ArticleBlock[] = [
      { type: "list", ordered: true, items: ["Pertama", "Kedua"] },
    ];

    const { container } = render(<ArticleBlocks blocks={blocks} />);

    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelector("ul")).toBeNull();
    expect(screen.getByText("Pertama").tagName).toBe("LI");
  });

  it("renders an unordered list as <ul>", () => {
    const blocks: ArticleBlock[] = [
      { type: "list", ordered: false, items: ["Satu"] },
    ];

    const { container } = render(<ArticleBlocks blocks={blocks} />);

    expect(container.querySelector("ul")).not.toBeNull();
    expect(container.querySelector("ol")).toBeNull();
  });

  it("renders headings and paragraphs in order", () => {
    const blocks: ArticleBlock[] = [
      { type: "heading", text: "Judul Bagian" },
      { type: "paragraph", text: "Isi paragraf." },
    ];

    render(<ArticleBlocks blocks={blocks} />);

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Judul Bagian");
    expect(screen.getByText("Isi paragraf.").tagName).toBe("P");
  });
});
