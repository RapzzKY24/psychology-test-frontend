// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ImportItemsDialog } from "@/features/admin/tests-builder/components/import-items-dialog";

afterEach(cleanup);

function setup() {
  const onImport = vi.fn();
  render(
    <ImportItemsDialog onImport={onImport}>
      <button type="button">Buka import</button>
    </ImportItemsDialog>,
  );
  fireEvent.click(screen.getByText("Buka import"));
  const box = screen.getByLabelText("Teks soal yang akan diimpor");
  return { onImport, box };
}

describe("ImportItemsDialog", () => {
  it("imports the parsed rows and closes", () => {
    const { onImport, box } = setup();

    fireEvent.change(box, { target: { value: "2 + 3 = ? | 4 | 5 | 6 | 7 | B" } });
    fireEvent.click(screen.getByText("Import 1 soal"));

    expect(onImport).toHaveBeenCalledWith([
      { question: "2 + 3 = ?", options: ["4", "5", "6", "7"], correctIndex: 1 },
    ]);
  });

  it("blocks the import and explains the broken line", () => {
    const { onImport, box } = setup();

    fireEvent.change(box, { target: { value: "2 + 3 = ? | 4 | B" } });

    expect(screen.getByText("Baris 1: butuh pertanyaan, minimal 2 opsi, dan kunci.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Import soal" })).toHaveProperty("disabled", true);
    expect(onImport).not.toHaveBeenCalled();
  });
});
