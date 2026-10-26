// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CoverImageUpload } from "@/features/admin/tests-builder/components/cover-image-upload";

vi.mock("@/features/admin/tests-builder/api", () => ({
  uploadTestCover: vi.fn(),
  updateTest: vi.fn(),
}));

afterEach(cleanup);

describe("CoverImageUpload", () => {
  it("shows the uploader when the test has no cover", () => {
    render(<CoverImageUpload testId="t1" value={null} onChanged={vi.fn()} />);

    expect(screen.getByText(/Belum ada gambar/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Hapus/ })).toBeNull();
  });

  it("previews an existing cover and offers removal", () => {
    render(
      <CoverImageUpload testId="t1" value="/uploads/test-covers/disc.png" onChanged={vi.fn()} />,
    );

    expect(screen.getByRole("img", { name: "Gambar katalog tes" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Hapus/ })).toBeTruthy();
  });

  it("rejects a non-image file before any request", () => {
    render(<CoverImageUpload testId="t1" value={null} onChanged={vi.fn()} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "notes.txt", { type: "text/plain" })] },
    });

    expect(screen.getByText("Format file tidak didukung (PNG/JPG).")).toBeTruthy();
  });
});
