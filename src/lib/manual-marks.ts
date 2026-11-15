import type { ManualMark } from "@/lib/api/types";

/**
 * Indonesian names for the eight printed marks. Shared by the runner (canvas
 * label), the review screen and the builder — the wording has to match on all
 * three, so it lives in one place rather than in the feature that first
 * needed it.
 */
export const MANUAL_MARK_LABELS: Record<ManualMark, string> = {
  DOT: "Satu titik",
  CURVE: "Garis bergelombang pendek",
  BARS: "Tiga garis vertikal meninggi",
  SQUARE: "Kotak hitam kecil",
  DIAGONALS: "Dua garis miring terputus",
  AXES: "Garis datar dan garis tegak",
  DOTTED_ARC: "Busur titik-titik",
  ARC: "Busur penuh",
};

/** How many boxes a drawing sheet has — 2 rows of 4 on the source sheet. */
export const MANUAL_BOX_COUNT = 8;
