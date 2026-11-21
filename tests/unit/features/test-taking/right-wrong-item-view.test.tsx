// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RightWrongItemView } from "@/features/test-taking/components/right-wrong-item-view";

afterEach(cleanup);

const OPTIONS = ["Merah", "Biru", "Hijau"];

function renderChoice({
  multi,
  chosen,
  onChoose,
}: {
  multi: boolean;
  chosen: number[];
  onChoose: (chosen: number[]) => void;
}) {
  render(
    <RightWrongItemView
      order={1}
      question="Pilih warna"
      options={OPTIONS}
      mode="choice"
      multi={multi}
      chosen={chosen}
      text=""
      disabled={false}
      onChoose={onChoose}
      onText={() => {}}
    />,
  );
}

describe("RightWrongItemView", () => {
  it("keeps a single pick when the selected option is clicked again", () => {
    // A radio must not clear itself: `chosen: []` would mean "no answer".
    const onChoose = vi.fn();
    renderChoice({ multi: false, chosen: [1], onChoose });

    fireEvent.click(screen.getByText("Biru"));

    expect(onChoose).toHaveBeenCalledWith([1]);
  });

  it("sends an empty selection when the last tick is removed", () => {
    // Unticking the only ticked box is a real answer ("cleared"), and the
    // server stores it as a blank instead of rejecting it with a 422.
    const onChoose = vi.fn();
    renderChoice({ multi: true, chosen: [2], onChoose });

    fireEvent.click(screen.getByText("Hijau"));

    expect(onChoose).toHaveBeenCalledWith([]);
  });

  it("adds a tick without dropping the earlier ones", () => {
    const onChoose = vi.fn();
    renderChoice({ multi: true, chosen: [0], onChoose });

    fireEvent.click(screen.getByText("Hijau"));

    expect(onChoose).toHaveBeenCalledWith([0, 2]);
  });
});
