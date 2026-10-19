// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TestCategoryFilters } from "@/features/public/components/test-category-filters";

afterEach(cleanup);

describe("TestCategoryFilters", () => {
  it("links every category plus an all-tests option", () => {
    render(<TestCategoryFilters />);
    expect(screen.getByRole("link", { name: "Semua" }).getAttribute("href")).toBe("/tes");
    expect(screen.getByRole("link", { name: "Kepribadian" }).getAttribute("href")).toBe(
      "/tes?category=PERSONALITY",
    );
    expect(screen.getByRole("link", { name: "Gaya Kerja" }).getAttribute("href")).toBe(
      "/tes?category=WORK_STYLE",
    );
  });

  it("marks the active category and links back to all tests", () => {
    render(<TestCategoryFilters category="COGNITIVE" />);
    expect(screen.getByRole("link", { name: "Kognitif" }).getAttribute("aria-current")).toBe(
      "true",
    );
    expect(screen.getByRole("link", { name: "Semua" }).getAttribute("aria-current")).toBeNull();
  });
});
