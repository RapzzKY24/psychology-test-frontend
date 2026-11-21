// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TimedGridItemView } from "@/features/test-taking/components/timed-grid-item-view";

afterEach(cleanup);

function renderGrid(
  answers: (number | null)[] = [null, null],
  overrides: Partial<React.ComponentProps<typeof TimedGridItemView>> = {},
) {
  const onChange = vi.fn();
  const onComplete = vi.fn();
  const onSkip = vi.fn();
  render(
    <TimedGridItemView
      column={3}
      digits={[2, 7, 7]}
      answers={answers}
      disabled={false}
      onChange={onChange}
      onComplete={onComplete}
      onSkip={onSkip}
      isLast={false}
      {...overrides}
    />,
  );
  return { onChange, onComplete, onSkip };
}

describe("TimedGridItemView", () => {
  it("draws one box between each pair of digits", () => {
    renderGrid();

    expect(screen.getByText("Lajur 3")).toBeTruthy();
    expect(screen.getByText("0 / 2 terisi")).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("skips the lajur even when no gap was filled", () => {
    const { onSkip } = renderGrid();

    fireEvent.click(screen.getByRole("button", { name: /Lewati lajur/i }));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("has nothing to skip to on the last lajur", () => {
    renderGrid([null, null], { isLast: true });

    expect(
      (screen.getByRole("button", { name: /Lewati lajur/i }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("reports a lajur once its last gap is filled", () => {
    const { onChange, onComplete } = renderGrid([9, null]);

    fireEvent.change(screen.getByLabelText("Jawaban antara 7 dan 7"), {
      target: { value: "4" },
    });

    expect(onChange).toHaveBeenCalledWith([9, 4]);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
