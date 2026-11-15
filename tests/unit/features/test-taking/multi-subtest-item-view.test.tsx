// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MultiSubtestItemView } from "@/features/test-taking/components/multi-subtest-item-view";

afterEach(cleanup);

const CHOICE = {
  kind: "CHOICE",
  prompt: "Pengaruh seseorang bergantung pada …",
  options: { a: "kekuasaan", b: "bujukan", c: "kekayaan", d: "keberanian", e: "kewibawaan" },
  key: "e",
};

function renderItem(content: Record<string, unknown>, answer = "", overrides = {}) {
  const onChoose = vi.fn();
  const onType = vi.fn();
  render(
    <MultiSubtestItemView
      order={7}
      content={content}
      answer={answer}
      disabled={false}
      onChoose={onChoose}
      onType={onType}
      {...overrides}
    />,
  );
  return { onChoose, onType };
}

describe("MultiSubtestItemView", () => {
  it("draws the five printed options of a choice item", () => {
    renderItem(CHOICE);

    expect(screen.getByText("Soal 7")).toBeTruthy();
    expect(screen.getByText("kekuasaan")).toBeTruthy();
    expect(screen.getByText("kewibawaan")).toBeTruthy();
  });

  it("reports the crossed letter", () => {
    const { onChoose } = renderItem(CHOICE);

    fireEvent.click(screen.getByText("kewibawaan"));
    expect(onChoose).toHaveBeenCalledWith("e");
  });

  it("marks the stored letter as picked", () => {
    renderItem(CHOICE, "c");

    const picked = screen.getByText("kekayaan").closest("button");
    expect(picked?.getAttribute("aria-pressed")).toBe("true");
  });

  it("draws a figure with only the five letters under it", () => {
    const { onChoose } = renderItem({
      kind: "IMAGE",
      imageUrl: "/uploads/test-items/abc-1.png",
      key: "a",
    });

    expect(screen.getByAltText("Gambar soal 7")).toBeTruthy();
    fireEvent.click(screen.getByText("d"));
    expect(onChoose).toHaveBeenCalledWith("d");
  });

  it("asks for the concept that covers two words", () => {
    const { onType } = renderItem({ kind: "PAIR", words: ["mawar", "melati"] });

    expect(screen.getByText("mawar")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Jawaban Anda"), { target: { value: "bunga" } });
    expect(onType).toHaveBeenCalledWith("bunga");
  });

  it("prints the series and takes a number", () => {
    const { onType } = renderItem({ kind: "NUMBER", series: [6, 9, 12], key: 15 });

    expect(screen.getByText("6")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Jawaban Anda"), { target: { value: "15" } });
    expect(onType).toHaveBeenCalledWith("15");
  });

  it("blocks every control when the window has closed", () => {
    renderItem(CHOICE, "", { disabled: true });

    expect(screen.getByText("kekuasaan").closest("button")?.hasAttribute("disabled")).toBe(true);
  });
});
