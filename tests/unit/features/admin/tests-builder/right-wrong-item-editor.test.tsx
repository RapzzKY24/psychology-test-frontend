// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { RightWrongItemEditor } from "@/features/admin/tests-builder/components/right-wrong-item-editor";
import type { BuilderController } from "@/features/admin/tests-builder/hooks/use-builder-form";

vi.mock("@/features/admin/tests-builder/components/item-image-upload", () => ({
  ItemImageUpload: ({ serverError }: { serverError?: string | null }) => (
    <p>{serverError ?? "upload"}</p>
  ),
}));

interface Values {
  items: {
    content: {
      question?: string;
      imageUrl?: string | null;
      options: string[];
      correctIndex: number;
    };
  }[];
}

function Harness({ error }: { error?: { path: string; message: string } }) {
  const form = useForm<Values>({
    defaultValues: { items: [{ content: { question: "", options: ["", ""], correctIndex: 0 } }] },
  });

  useEffect(() => {
    if (error) {
      form.setError(`items.0.content.${error.path}` as never, { message: error.message });
    }
  }, [form, error]);

  return (
    <RightWrongItemEditor
      builder={{ form } as unknown as BuilderController}
      active={0}
      total={1}
      testId="test-1"
      locked={false}
      onMove={() => {}}
      onRemove={() => {}}
      onDuplicate={() => {}}
    />
  );
}

afterEach(cleanup);

describe("RightWrongItemEditor", () => {
  it("shows the question error under the question field", async () => {
    render(
      <Harness error={{ path: "question", message: "Pertanyaan atau gambar wajib diisi." }} />,
    );

    expect(await screen.findByText("Pertanyaan atau gambar wajib diisi.")).toBeTruthy();
    expect(screen.getByLabelText(/Pertanyaan/).getAttribute("aria-invalid")).toBe("true");
  });

  it("shows the image error next to the picker", async () => {
    render(<Harness error={{ path: "imageUrl", message: "Gambar harus dari upload." }} />);

    expect(await screen.findByText("Gambar harus dari upload.")).toBeTruthy();
  });
});
