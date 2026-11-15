// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MarkGroupItemView } from "@/features/test-taking/components/mark-group-item-view";

afterEach(cleanup);

const OPTIONS = ["Berkebun", "Membongkar mesin", "Melukis"];

function renderView(overrides: Partial<Parameters<typeof MarkGroupItemView>[0]> = {}) {
  const onChange = vi.fn();
  render(
    <MarkGroupItemView
      order={3}
      question="Kelompok 3"
      options={OPTIONS}
      marks={{ liked: [], disliked: [] }}
      disabled={false}
      onChange={onChange}
      {...overrides}
    />,
  );
  return { onChange };
}

describe("MarkGroupItemView", () => {
  it("draws one + and one - button per activity", () => {
    renderView();

    expect(screen.getByText("Soal 3")).toBeTruthy();
    expect(screen.getByText("Kelompok 3")).toBeTruthy();
    for (const option of OPTIONS) {
      expect(screen.getByLabelText(`${option} — suka`)).toBeTruthy();
      expect(screen.getByLabelText(`${option} — tidak suka`)).toBeTruthy();
    }
  });

  it("reports a like as an index in the liked list", () => {
    const { onChange } = renderView();

    fireEvent.click(screen.getByLabelText("Membongkar mesin — suka"));
    expect(onChange).toHaveBeenCalledWith({ liked: [1], disliked: [] });
  });

  it("takes a like back when the same mark is clicked again", () => {
    const { onChange } = renderView({ marks: { liked: [1], disliked: [] } });

    fireEvent.click(screen.getByLabelText("Membongkar mesin — suka"));
    expect(onChange).toHaveBeenCalledWith({ liked: [], disliked: [] });
  });

  it("moves an activity from liked to disliked instead of keeping both", () => {
    const { onChange } = renderView({ marks: { liked: [0, 2], disliked: [] } });

    fireEvent.click(screen.getByLabelText("Berkebun — tidak suka"));
    expect(onChange).toHaveBeenCalledWith({ liked: [2], disliked: [0] });
  });

  it("marks the stored rows and counts them", () => {
    renderView({ marks: { liked: [0], disliked: [2] } });

    expect(screen.getByLabelText("Berkebun — suka").getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getByLabelText("Melukis — tidak suka").getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText("Ditandai 2 dari 3")).toBeTruthy();
  });

  it("clears every mark from the reset button", () => {
    const { onChange } = renderView({ marks: { liked: [0], disliked: [1] } });

    fireEvent.click(screen.getByRole("button", { name: /ulangi/i }));
    expect(onChange).toHaveBeenCalledWith({ liked: [], disliked: [] });
  });

  it("locks every button when time is up", () => {
    renderView({ disabled: true });

    expect(screen.getByLabelText("Berkebun — suka").hasAttribute("disabled")).toBe(true);
    expect(screen.getByLabelText("Berkebun — tidak suka").hasAttribute("disabled")).toBe(true);
  });
});
