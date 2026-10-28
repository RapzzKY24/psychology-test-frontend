// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetchRaw = vi.fn();

vi.mock("@/lib/api/client", () => ({
  apiFetchRaw: (path: string) => apiFetchRaw(path),
}));

import { downloadFile, filenameFromDisposition } from "@/lib/download";

function responseWith(init: {
  ok?: boolean;
  status?: number;
  disposition?: string | null;
  body?: string;
}): Response {
  const headers = new Headers();
  if (init.disposition) headers.set("Content-Disposition", init.disposition);

  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    headers,
    blob: async () => new Blob([init.body ?? "%PDF-1.7"]),
    text: async () => init.body ?? "",
  } as unknown as Response;
}

describe("filenameFromDisposition", () => {
  it("reads a quoted filename", () => {
    expect(
      filenameFromDisposition('attachment; filename="Invoice-INV-2026-0001.pdf"'),
    ).toBe("Invoice-INV-2026-0001.pdf");
  });

  it("returns null when the header is absent", () => {
    expect(filenameFromDisposition(null)).toBeNull();
  });
});

describe("downloadFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:invoice");
    URL.revokeObjectURL = vi.fn();
    HTMLAnchorElement.prototype.click = vi.fn();
  });

  it("names the file after the server header", async () => {
    apiFetchRaw.mockResolvedValue(
      responseWith({
        disposition: 'attachment; filename="Invoice-INV-2026-0001.pdf"',
      }),
    );

    await downloadFile("/admin/invoices/inv1/pdf", "fallback.pdf");

    expect(apiFetchRaw).toHaveBeenCalledWith("/admin/invoices/inv1/pdf");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:invoice");
  });

  it("falls back when the server sends no filename", async () => {
    apiFetchRaw.mockResolvedValue(responseWith({ disposition: null }));

    await expect(
      downloadFile("/admin/invoices/inv1/pdf", "Invoice-INV-2026-0001.pdf"),
    ).resolves.toBeUndefined();
  });

  it("throws ApiError on a non-2xx response", async () => {
    apiFetchRaw.mockResolvedValue(
      responseWith({
        ok: false,
        status: 404,
        body: JSON.stringify({
          statusCode: 404,
          message: "Invoice not found",
          error: "Not Found",
        }),
      }),
    );

    await expect(
      downloadFile("/admin/invoices/inv1/pdf", "fallback.pdf"),
    ).rejects.toMatchObject({ statusCode: 404, isNotFound: true });
  });
});
