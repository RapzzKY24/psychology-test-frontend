"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CertificateFormData } from "@/lib/api/types";
import {
  GENDER_LABELS,
  GENDER_VALUES,
  VERDICT_LABELS,
  VERDICT_VALUES,
  buildCertificatePayload,
  fieldLabel,
  missingFieldsOf,
  remainingLabel,
  toCertificateValues,
} from "../schemas";
import type { CertificateFormValues } from "../schemas";
import {
  useIssueCertificate,
  useSaveCertificateDraft,
} from "../hooks/use-certificate-mutations";
import { usePreviewCertificate } from "../hooks/use-certificate-document";
import { CertificatePhotoField } from "./certificate-photo-field";

/**
 * The certificate editor. Plain state, not react-hook-form: every field is
 * optional until publish, and the backend owns completeness.
 */
export function CertificateForm({ form }: { form: CertificateFormData }) {
  const [values, setValues] = useState<CertificateFormValues>(() => toCertificateValues(form));
  const [photoPath, setPhotoPath] = useState(form.certificate.photoPath);
  const [photoKey, setPhotoKey] = useState(form.certificate.updatedAt);

  const save = useSaveCertificateDraft(form.certificate.id, (next) => {
    setPhotoPath(next.certificate.photoPath);
    setPhotoKey(next.certificate.updatedAt);
  });
  const issue = useIssueCertificate(form.certificate.id);
  const preview = usePreviewCertificate();

  const missing = missingFieldsOf(values, photoPath);
  const ready = form.readiness.profileComplete && missing.length === 0;

  function set<K extends keyof CertificateFormValues>(key: K, value: CertificateFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Sertifikat untuk</p>
          <p className="font-medium">
            {form.result.participantName ?? "Peserta"} · {form.result.testName}
          </p>
          <p className="text-sm text-muted-foreground">{form.result.sessionTitle ?? "—"}</p>
        </div>
        <Badge variant="secondary">Draf</Badge>
      </section>

      {!form.readiness.profileComplete && (
        <p className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          Profil atau tanda tangan belum lengkap.
          <Link href="/psikolog/profil" className="font-medium text-primary hover:underline">
            Lengkapi profil
          </Link>
        </p>
      )}

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-sm font-semibold">Identitas peserta</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="cert-full-name">Nama lengkap</FieldLabel>
            <Input
              id="cert-full-name"
              value={values.fullName}
              maxLength={120}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-id-number">NIK</FieldLabel>
            <Input
              id="cert-id-number"
              value={values.idNumber}
              maxLength={40}
              inputMode="numeric"
              onChange={(e) => set("idNumber", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-gender">Jenis kelamin</FieldLabel>
            <Select
              value={values.gender || undefined}
              onValueChange={(value) => set("gender", value as CertificateFormValues["gender"])}
            >
              <SelectTrigger id="cert-gender" className="w-full">
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {GENDER_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-birth-place">Tempat lahir</FieldLabel>
            <Input
              id="cert-birth-place"
              value={values.birthPlace}
              maxLength={80}
              onChange={(e) => set("birthPlace", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-birth-date">Tanggal lahir</FieldLabel>
            <Input
              id="cert-birth-date"
              type="date"
              value={values.birthDate}
              onChange={(e) => set("birthDate", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-age">Usia</FieldLabel>
            <Input
              id="cert-age"
              type="number"
              min={0}
              max={150}
              value={values.age}
              onChange={(e) => set("age", e.target.value)}
            />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="cert-address">Alamat</FieldLabel>
            <Textarea
              id="cert-address"
              value={values.address}
              maxLength={300}
              rows={2}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border p-4">
        <h2 className="text-sm font-semibold">Isi sertifikat</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="cert-verdict">Vonis</FieldLabel>
            <Select
              value={values.verdict || undefined}
              onValueChange={(value) => set("verdict", value as CertificateFormValues["verdict"])}
            >
              <SelectTrigger id="cert-verdict" className="w-full">
                <SelectValue placeholder="Pilih vonis" />
              </SelectTrigger>
              <SelectContent>
                {VERDICT_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {VERDICT_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-purpose">Tujuan</FieldLabel>
            <Input
              id="cert-purpose"
              value={values.purpose}
              maxLength={200}
              placeholder="CPMI"
              onChange={(e) => set("purpose", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cert-valid-until">Berlaku sampai</FieldLabel>
            <Input
              id="cert-valid-until"
              type="date"
              value={values.validUntil}
              onChange={(e) => set("validUntil", e.target.value)}
            />
          </Field>
        </div>

        <CertificatePhotoField
          certificateId={form.certificate.id}
          photoPath={photoPath}
          cacheKey={photoKey}
          onSaved={(next) => {
            setPhotoPath(next.certificate.photoPath);
            setPhotoKey(next.certificate.updatedAt);
          }}
        />
      </section>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/95 p-3 backdrop-blur">
        <div className="text-sm">
          {ready ? (
            <p className="font-medium text-primary">Semua kolom terisi — siap diterbitkan.</p>
          ) : (
            <>
              <p className="font-medium">{remainingLabel(missing.length)}</p>
              {missing.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {missing.slice(0, 3).map(fieldLabel).join(", ")}
                  {missing.length > 3 ? ", …" : ""}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={preview.isPending}
            onClick={() => preview.mutate(form.certificate.id)}
          >
            <Eye className="size-4" aria-hidden />
            {preview.isPending ? "Menyiapkan..." : "Pratinjau"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={save.isPending}
            onClick={() => save.mutate(buildCertificatePayload(values))}
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
                <AlertDialogTitle>Terbitkan sertifikat ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isian disimpan lalu nomor sertifikat dibuat dan seluruh isi dibekukan. Setelah
                  terbit, sertifikat tidak bisa diedit — koreksi hanya lewat revisi baru.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => issue.mutate(buildCertificatePayload(values))}>
                  Ya, terbitkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
