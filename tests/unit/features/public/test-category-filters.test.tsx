// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TestCategoryFilters } from "@/features/public/components/test-category-filters";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe("TestCategoryFilters", () => {
  it("offers every category plus an all-tests option", () => {
    render(<TestCategoryFilters />);
    const select = screen.getByLabelText("Kategori tes") as HTMLSelectElement;

    expect(Array.from(select.options).map((option) => option.textContent)).toEqual([
      "Semua kategori",
      "Kepribadian",
      "Kognitif",
      "Gaya Kerja",
      "Minat",
      "Projektif",
    ]);
  });

  it("marks the active category", () => {
    render(<TestCategoryFilters category="COGNITIVE" />);
    const select = screen.getByLabelText("Kategori tes") as HTMLSelectElement;

    expect(select.value).toBe("COGNITIVE");
  });

  it("navigates to the chosen category", () => {
    render(<TestCategoryFilters />);
    fireEvent.change(screen.getByLabelText("Kategori tes"), {
      target: { value: "COGNITIVE" },
    });

    expect(push).toHaveBeenCalledWith("/tes?category=COGNITIVE", { scroll: false });
  });
});
