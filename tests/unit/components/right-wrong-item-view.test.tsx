// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RightWrongItemView } from "@/features/test-taking/components/right-wrong-item-view";

afterEach(cleanup);

const base = {
  order: 7,
  question: "Seri: lanjutkan pola berikut.",
  imageUrl: "/uploads/test-items/figure.png",
  mode: "choice" as const,
  multi: false,
  chosen: [] as number[],
  text: "",
  disabled: false,
  onChoose: () => {},
  onText: () => {},
};

describe("RightWrongItemView", () => {
  it("renders a bare letter grid for figure items", () => {
    render(<RightWrongItemView {...base} options={["a", "b", "c", "d", "e", "f"]} />);

    // The printed figure labels its options a–f; the button shows one label,
    // not "A" next to "a".
    expect(screen.getAllByText("a")).toHaveLength(1);
    for (const label of ["a", "b", "c", "d", "e", "f"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
    expect(screen.getByText(/Pilih satu jawaban/)).toBeTruthy();
  });

  it("keeps the letter and text rows for a written-option item", () => {
    render(<RightWrongItemView {...base} options={["Jakarta", "Bandung"]} />);

    expect(screen.getByText("Jakarta")).toBeTruthy();
    expect(screen.getByRole("button", { name: /A\s*Jakarta/ })).toBeTruthy();
  });

  it("replaces the answer in single-choice mode", () => {
    const onChoose = vi.fn();
    render(<RightWrongItemView {...base} options={["a", "b", "c"]} onChoose={onChoose} />);

    fireEvent.click(screen.getByRole("button", { name: "c" }));
    expect(onChoose).toHaveBeenCalledWith([2]);
  });

  it("toggles letters in multi-choice mode", () => {
    const onChoose = vi.fn();
    render(
      <RightWrongItemView
        {...base}
        multi
        chosen={[0]}
        options={["a", "b", "c", "d", "e"]}
        onChoose={onChoose}
      />,
    );

    expect(screen.getByText(/Pilih semua jawaban/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "e" }));
    expect(onChoose).toHaveBeenCalledWith([0, 4]);
    fireEvent.click(screen.getByRole("button", { name: "a" }));
    expect(onChoose).toHaveBeenLastCalledWith([]);
  });
});
