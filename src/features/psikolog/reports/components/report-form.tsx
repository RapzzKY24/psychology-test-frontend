"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RatingValue, Recommendation, ReportFormData } from "@/lib/api/types";
import { RECOMMENDATION_LABELS, RECOMMENDATION_VALUES } from "../rubric";
import { buildReportPayload, fieldLabel, remainingLabel, toReportValues } from "../schemas";
import { useIssueReport, useSaveReportDraft } from "../hooks/use-report-mutations";
import { NarrativeFields } from "./narrative-fields";
import { RatingSections } from "./rating-sections";
import { ReportIdentity } from "./report-identity";

/**
 * The 19-field assessment form. Plain state, not react-hook-form: every field
 * is optional until issue time and the backend owns completeness, so there is
 * no client-side rule set for a resolver to enforce.
 */
export function ReportForm({ form }: { form: ReportFormData }) {
  const [values, setValues] = useState(() => toReportValues(form));
  const [readiness, setReadiness] = useState(form.readiness);
  const save = useSaveReportDraft(form.participant.id, setReadiness);
  const issue = useIssueReport(form.participant.id);

  const ready =
    readiness.testsApproved && readiness.profileComplete && readiness.missingFields.length === 0;

  function setRating(key: string, value: RatingValue) {
    setValues((prev) => ({ ...prev, ratings: { ...prev.ratings, [key]: value } }));
  }

  function setNarrative(key: string, value: string) {
    setValues((prev) => ({ ...prev, narratives: { ...prev.narratives, [key]: value } }));
  }

  function setRecommendation(value: string) {
    setValues((prev) => ({ ...prev, recommendation: value as Recommendation }));
  }

  return (
    <div className="space-y-5">
      <ReportIdentity form={form} />

      {!readiness.testsApproved && (
        <p className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          Masih ada tes yang belum disetujui. Laporan bisa diisi, tapi belum bisa diterbitkan.
        </p>
      )}

      {!readiness.profileComplete && (
        <p className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          Profil atau tanda tangan belum lengkap.
          <Link href="/psikolog/profil" className="font-medium text-primary hover:underline">
            Lengkapi profil
          </Link>
        </p>
      )}

      <RatingSections values={values.ratings} onChange={setRating} />

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-sm font-semibold">Kesimpulan &amp; Saran</h2>
        <NarrativeFields values={values.narratives} onChange={setNarrative} />
      </section>

      <section className="rounded-lg border p-4">
        <Field>
          <FieldLabel htmlFor="report-recommendation">Rekomendasi</FieldLabel>
          <Select value={values.recommendation || undefined} onValueChange={setRecommendation}>
            <SelectTrigger id="report-recommendation" className="w-full sm:w-64">
              <SelectValue placeholder="Pilih rekomendasi" />
            </SelectTrigger>
            <SelectContent>
              {RECOMMENDATION_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {RECOMMENDATION_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/95 p-3 backdrop-blur">
        <div className="text-sm">
          {ready ? (
            <p className="font-medium text-primary">Semua kolom terisi — siap diterbitkan.</p>
          ) : (
            <>
              <p className="font-medium">{remainingLabel(readiness.missingFields.length)}</p>
              {readiness.missingFields.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {readiness.missingFields.slice(0, 3).map(fieldLabel).join(", ")}
                  {readiness.missingFields.length > 3 ? ", …" : ""}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={save.isPending}
            onClick={() => save.mutate(buildReportPayload(values))}
          >
            {save.isPending ? "Menyimpan..." : "Simpan Draf"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" disabled={!ready || issue.isPending}>
                {issue.isPending ? "Menerbitkan..." : "Terbitkan"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Terbitkan laporan ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Nomor laporan langsung dibuat dan seluruh isi dibekukan. Setelah terbit, laporan
                  tidak bisa diedit — koreksi hanya lewat admin sebagai revisi baru.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => issue.mutate()}>Ya, terbitkan</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
