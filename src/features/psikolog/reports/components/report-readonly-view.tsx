import type { ReportFormData } from "@/lib/api/types";
import { RECOMMENDATION_LABELS } from "../rubric";
import { toReportValues } from "../schemas";
import { NarrativeFields } from "./narrative-fields";
import { RatingSections } from "./rating-sections";
import { ReportIdentity } from "./report-identity";

/**
 * The issued report as the psychologist filled it — same sections, same order,
 * but every control replaced by text. Corrections go through an admin revision,
 * never an edit here.
 */
export function ReportReadOnly({ form }: { form: ReportFormData }) {
  const values = toReportValues(form);
  const recommendation = form.report?.recommendation ?? null;

  return (
    <div className="space-y-5">
      <ReportIdentity form={form} />

      <RatingSections values={values.ratings} readOnly />

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-sm font-semibold">Kesimpulan &amp; Saran</h2>
        <NarrativeFields values={values.narratives} readOnly />
      </section>

      <section className="rounded-lg border p-4">
        <p className="text-xs text-muted-foreground">Rekomendasi</p>
        <p className="text-sm font-medium">
          {recommendation ? RECOMMENDATION_LABELS[recommendation] : "Belum diisi"}
        </p>
      </section>
    </div>
  );
}
