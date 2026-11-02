import { z } from "zod";
import type {
  RatingValue,
  Recommendation,
  ReportDraftPayload,
  ReportFormData,
} from "@/lib/api/types";
import { NARRATIVE_FIELDS, NARRATIVE_MAX_LENGTH, RATING_KEYS, RATING_SECTIONS } from "./rubric";

/** Form state — an empty string means "not filled yet", never a valid value. */
export interface ReportDraftValues {
  ratings: Record<string, RatingValue | "">;
  narratives: Record<string, string>;
  recommendation: Recommendation | "";
}

/** Seeds the form from the API response; every key exists so inputs are controlled. */
export function toReportValues(form: ReportFormData): ReportDraftValues {
  const ratings: Record<string, RatingValue | ""> = {};
  for (const key of RATING_KEYS) {
    ratings[key] = form.report?.ratings[key] ?? "";
  }

  const narratives: Record<string, string> = {};
  for (const field of NARRATIVE_FIELDS) {
    narratives[field.key] = form.report?.narratives[field.key] ?? "";
  }

  return {
    ratings,
    narratives,
    recommendation: form.report?.recommendation ?? "",
  };
}

/**
 * Drops untouched fields instead of sending empty strings: the backend merges,
 * and an empty string would either overwrite a saved narrative or fail the
 * rating enum.
 */
export function buildReportPayload(values: ReportDraftValues): ReportDraftPayload {
  const ratings: Record<string, RatingValue> = {};
  for (const [key, value] of Object.entries(values.ratings)) {
    if (value !== "") ratings[key] = value;
  }

  const narratives: Record<string, string> = {};
  for (const [key, value] of Object.entries(values.narratives)) {
    const trimmed = value.trim();
    if (trimmed.length > 0) narratives[key] = trimmed;
  }

  const payload: ReportDraftPayload = {};
  if (Object.keys(ratings).length > 0) payload.ratings = ratings;
  if (Object.keys(narratives).length > 0) payload.narratives = narratives;
  if (values.recommendation !== "") payload.recommendation = values.recommendation;
  return payload;
}

/** Shape check before the request leaves the browser (the backend re-validates). */
export const ReportDraftSchema = z.object({
  ratings: z.record(z.string(), z.enum(["R", "K", "C", "B", "T"])),
  narratives: z.record(z.string(), z.string().max(NARRATIVE_MAX_LENGTH)),
  recommendation: z.enum(["LAYAK", "BELUM_LAYAK", "TIDAK_LAYAK"]),
});

/** Labels for the backend's `missingFields` names, so the UI never prints a key. */
const FIELD_LABELS: Record<string, string> = Object.fromEntries([
  ...RATING_SECTIONS.flatMap((section) =>
    section.aspects.map((aspect) => [aspect.key, aspect.label] as const),
  ),
  ...NARRATIVE_FIELDS.map((field) => [field.key, field.label] as const),
  ["recommendation", "Rekomendasi"],
]);

export function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

export function remainingLabel(count: number): string {
  return count === 1 ? "1 kolom belum diisi" : `${count} kolom belum diisi`;
}
