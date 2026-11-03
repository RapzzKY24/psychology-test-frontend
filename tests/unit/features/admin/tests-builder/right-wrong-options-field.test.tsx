// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { RightWrongOptionsField } from "@/features/admin/tests-builder/components/right-wrong-options-field";
import type { BuilderController } from "@/features/admin/tests-builder/hooks/use-builder-form";

interface Values {
  items: { content: { question?: string; options: string[]; correctIndexes: number[] } }[];
}

function Harness({
  options,
  correctIndexes,
  onForm,
}: {
  options: string[];
  correctIndexes: number[];
  onForm: (form: ReturnType<typeof useForm<Values>>) => void;
}) {
  const form = useForm<Values>({
    defaultValues: { items: [{ content: { options, correctIndexes } }] },
  });
  onForm(form);
  const content = form.watch("items.0.content");

  return (
    <RightWrongOptionsField
      builder={{ form } as unknown as BuilderController}
      active={0}
      options={content.options}
      correctIndexes={content.correctIndexes}
      locked={false}
    />
  );
}

function setup(options: string[], correctIndexes: number[]) {
  let form!: ReturnType<typeof useForm<Values>>;
  render(<Harness options={options} correctIndexes={correctIndexes} onForm={(f) => (form = f)} />);
  return {
    keys: () => form.getValues("items.0.content.correctIndexes"),
    options: () => form.getValues("items.0.content.options"),
  };
}

afterEach(cleanup);

describe("RightWrongOptionsField", () => {
  it("drags the answer key down when an earlier option is deleted", () => {
    const state = setup(["A", "B", "C"], [1]);

    fireEvent.click(screen.getByLabelText("Hapus opsi 1"));

    expect(state.options()).toEqual(["B", "C"]);
    expect(state.keys()).toEqual([0]);
  });

  it("keeps the answer key when a later option is deleted", () => {
    const state = setup(["A", "B", "C"], [0]);

    fireEvent.click(screen.getByLabelText("Hapus opsi 3"));

    expect(state.keys()).toEqual([0]);
  });

  it("keeps a trailing key inside the remaining options", () => {
    const state = setup(["A", "B", "C"], [2]);

    fireEvent.click(screen.getByLabelText("Hapus opsi 1"));

    expect(state.keys()).toEqual([1]);
  });

  it("drops the key when its own option is deleted", () => {
    const state = setup(["A", "B", "C"], [1]);

    fireEvent.click(screen.getByLabelText("Hapus opsi 2"));

    expect(state.keys()).toEqual([]);
  });

  it("adds and removes keys for a multi-answer item", () => {
    const state = setup(["A", "B", "C", "D"], [0]);

    fireEvent.click(screen.getByLabelText("Kunci opsi 3"));
    expect(state.keys()).toEqual([0, 2]);

    fireEvent.click(screen.getByLabelText("Kunci opsi 1"));
    expect(state.keys()).toEqual([2]);
  });

  it("refuses to go below two options", () => {
    setup(["A", "B"], [0]);

    expect(screen.getByLabelText("Hapus opsi 1")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Hapus opsi 2")).toHaveProperty("disabled", true);
  });
});
