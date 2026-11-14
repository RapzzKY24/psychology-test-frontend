// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RankGroupItemView } from "@/features/test-taking/components/rank-group-item-view";

afterEach(cleanup);

const OPTIONS = ["Petani", "Insinyur sipil", "Akuntan", "Dokter"];

function setup(ranks: number[] = OPTIONS.map(() => 0)) {
  const onRank = vi.fn();
  render(
    <RankGroupItemView
      order={1}
      question="Kelompok A"
      options={OPTIONS}
      ranks={ranks}
      disabled={false}
      onRank={onRank}
    />,
  );
  return { onRank };
}

describe("RankGroupItemView", () => {
  it("draws one row per occupation, all unranked at first", () => {
    setup();

    expect(screen.getByText("Kelompok A")).toBeTruthy();
    for (const option of OPTIONS) {
      expect(screen.getByLabelText(`${option} — belum diurutkan`)).toBeTruthy();
    }
    expect(screen.getByText("Terurut 0 dari 4")).toBeTruthy();
  });

  it("assigns the next rank when a row is clicked", () => {
    const { onRank } = setup();

    fireEvent.click(screen.getByLabelText("Akuntan — belum diurutkan"));

    expect(onRank).toHaveBeenCalledWith([0, 0, 1, 0]);
  });

  it("appends after the highest rank already used", () => {
    const { onRank } = setup([2, 1, 0, 0]);

    fireEvent.click(screen.getByLabelText("Dokter — belum diurutkan"));

    expect(onRank).toHaveBeenCalledWith([2, 1, 0, 3]);
  });

  it("clears a rank and closes the gap below it", () => {
    const { onRank } = setup([2, 1, 3, 4]);

    fireEvent.click(screen.getByLabelText("Insinyur sipil — urutan 1"));

    expect(onRank).toHaveBeenCalledWith([1, 0, 2, 3]);
  });

  it("marks ranked rows and shows the running count", () => {
    setup([1, 2, 0, 0]);

    expect(screen.getByLabelText("Petani — urutan 1")).toBeTruthy();
    expect(screen.getByLabelText("Insinyur sipil — urutan 2")).toBeTruthy();
    expect(screen.getByText("Terurut 2 dari 4")).toBeTruthy();
  });

  it("resets the whole group", () => {
    const { onRank } = setup([1, 2, 3, 4]);

    fireEvent.click(screen.getByRole("button", { name: /Ulangi/ }));

    expect(onRank).toHaveBeenCalledWith([0, 0, 0, 0]);
  });

  it("ignores clicks when the attempt is over", () => {
    const onRank = vi.fn();
    render(
      <RankGroupItemView
        order={1}
        question="Kelompok A"
        options={OPTIONS}
        ranks={[0, 0, 0, 0]}
        disabled
        onRank={onRank}
      />,
    );

    fireEvent.click(screen.getByLabelText("Petani — belum diurutkan"));

    expect(onRank).not.toHaveBeenCalled();
  });
});
