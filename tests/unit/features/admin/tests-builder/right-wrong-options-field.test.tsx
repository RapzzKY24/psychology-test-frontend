// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { RightWrongOptionsField } from "@/features/admin/tests-builder/components/right-wrong-options-field";
import type { BuilderController } from "@/features/admin/tests-builder/hooks/use-builder-form";

interface Values {
  items: { content: { question?: string; options: string[]; correctIndex: number } }[];
}

function Harness({
  options,
  correctIndex,
  onForm,
}: {
  options: string[];
  correctIndex: number;
  onForm: (form: ReturnType<typeof useForm<Values>>) => void;
}) {
  const form = useForm<Values>({
    defaultValues: { items: [{ content: { options, correctIndex } }] },
  });
  onForm(form);
  const content = form.watch("items.0.content");

  return (
    <RightWrongOptionsField
      builder={{ form } as unknown as BuilderController}
      active={0}
      options={content.options}
      correctIndex={content.correctIndex}
      locked={false}
    />
  );
}

function setup(options: string[], correctIndex: number) {
  let form!: ReturnType<typeof useForm<Values>>;
  render(<Harness options={options} correctIndex={correctIndex} onForm={(f) => (form = f)} />);
  return {
    key: () => form.getValues("items.0.content.correctIndex"),
    options: () => form.getValues("items.0.content.options"),
  };
}

afterEach(cleanup);

describe("RightWrongOptionsField", () => {
  it("drags the answer key down when an earlier option is deleted", () => {
    const state = setup(["A", "B", "C"], 1);

    fireEvent.click(screen.getByLabelText("Hapus opsi 1"));

    expect(state.options()).toEqual(["B", "C"]);
    expect(state.key()).toBe(0);
  });

  it("keeps the answer key when a later option is deleted", () => {
    const state = setup(["A", "B", "C"], 0);

    fireEvent.click(screen.getByLabelText("Hapus opsi 3"));

    expect(state.key()).toBe(0);
  });

  it("never leaves the key pointing past the last option", () => {
    const state = setup(["A", "B", "C"], 2);

    fireEvent.click(screen.getByLabelText("Hapus opsi 3"));

    expect(state.key()).toBe(1);
  });

  it("refuses to go below two options", () => {
    setup(["A", "B"], 0);

    expect(screen.getByLabelText("Hapus opsi 1")).toHaveProperty("disabled", true);
    expect(screen.getByLabelText("Hapus opsi 2")).toHaveProperty("disabled", true);
  });
});
