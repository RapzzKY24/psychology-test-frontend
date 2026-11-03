// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useFieldArray, useForm } from "react-hook-form";
import { InterpretationsTab } from "@/features/admin/tests-builder/components/interpretations-tab";
import type {
  BuilderController,
  BuilderFormValues,
} from "@/features/admin/tests-builder/hooks/use-builder-form";

afterEach(cleanup);

function Harness({
  onForm,
}: {
  onForm: (form: ReturnType<typeof useForm<BuilderFormValues>>) => void;
}) {
  const form = useForm<BuilderFormValues>({
    defaultValues: { items: [], interpretations: [] },
  });
  const interpretationsArray = useFieldArray({ control: form.control, name: "interpretations" });
  const [activePattern, setActivePattern] = useState("1");
  onForm(form);

  const builder = {
    form,
    interpretationsArray,
    activePattern,
    setActivePattern,
    missingCodes: [],
    scorerType: "FORCED_CHOICE_DISC",
  } as unknown as BuilderController;

  return <InterpretationsTab builder={builder} locked={false} />;
}

describe("InterpretationsTab", () => {
  it("creates one row when an empty chip is clicked twice", () => {
    let form!: ReturnType<typeof useForm<BuilderFormValues>>;
    render(<Harness onForm={(f) => (form = f)} />);

    const chip = screen.getByLabelText("Pola 1 (kosong)");
    act(() => {
      chip.click();
      chip.click();
    });

    expect(form.getValues("interpretations")).toHaveLength(1);
  });
});
