// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LikertItemView } from "@/features/test-taking/components/likert-item-view";

afterEach(cleanup);

const LABELS = ["Tidak sama sekali", "Agak", "Cukup baik", "Sangat baik"];

describe("LikertItemView", () => {
  it("draws one button per point of the scale", () => {
    render(
      <LikertItemView
        order={7}
        text="Saya suka bergaul"
        min={0}
        max={3}
        rating={null}
        disabled={false}
        onRate={() => {}}
      />,
    );

    expect(screen.getByText("Soal 7")).toBeTruthy();
    for (const value of [0, 1, 2, 3]) {
      expect(screen.getByLabelText(`Nilai ${value}`)).toBeTruthy();
    }
  });

  it("spells out what each point means when the test ships labels", () => {
    render(
      <LikertItemView
        order={1}
        text="Saya suka bergaul"
        min={0}
        max={3}
        labels={LABELS}
        rating={null}
        disabled={false}
        onRate={() => {}}
      />,
    );

    for (const label of LABELS) {
      expect(screen.getByText(label)).toBeTruthy();
    }
    // The number is part of the accessible name, not just the legend.
    expect(screen.getByLabelText("Nilai 2 — Cukup baik")).toBeTruthy();
  });

  it("ignores a label list that does not match the scale", () => {
    render(
      <LikertItemView
        order={1}
        text="Saya suka bergaul"
        min={1}
        max={5}
        labels={["a", "b"]}
        rating={null}
        disabled={false}
        onRate={() => {}}
      />,
    );

    expect(screen.queryByText("a")).toBeNull();
    // Falls back to the familiar five-point ends.
    expect(screen.getByText("Sangat sesuai")).toBeTruthy();
  });

  it("reports the picked rating", () => {
    const onRate = vi.fn();
    render(
      <LikertItemView
        order={1}
        text="Saya suka bergaul"
        min={1}
        max={5}
        rating={null}
        disabled={false}
        onRate={onRate}
      />,
    );

    fireEvent.click(screen.getByLabelText("Nilai 4"));
    expect(onRate).toHaveBeenCalledWith(4);
  });

  it("marks the stored rating and disables the row when time is up", () => {
    render(
      <LikertItemView
        order={1}
        text="Saya suka bergaul"
        min={1}
        max={5}
        rating={3}
        disabled
        onRate={() => {}}
      />,
    );

    expect(screen.getByLabelText("Nilai 3").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByLabelText("Nilai 4").hasAttribute("disabled")).toBe(true);
  });
});
