import { apiFetchRaw } from "./api/client";
import { parseErrorResponse } from "./api/error";

/** Ambil nama file dari header; fallback ke nama yang dikirim pemanggil. */
const FILENAME_PATTERN = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i;

export function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const match = FILENAME_PATTERN.exec(header);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
}

async function errorPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Unduh endpoint biner (PDF invoice). Cookie sesi ikut karena memakai
 * `apiFetchRaw`, jadi endpoint yang butuh role tetap bisa diakses.
 */
export async function downloadFile(
  path: string,
  fallbackFilename: string,
): Promise<void> {
  const response = await apiFetchRaw(path);

  if (!response.ok) {
    throw parseErrorResponse(response.status, await errorPayload(response));
  }

  const filename =
    filenameFromDisposition(response.headers.get("Content-Disposition")) ??
    fallbackFilename;

  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
