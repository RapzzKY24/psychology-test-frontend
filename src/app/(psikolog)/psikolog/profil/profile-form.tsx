"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PsychologistProfile } from "@/lib/api/types";
import { useProfileForm } from "@/features/psikolog/profil/hooks/use-profile-form";

export function ProfileForm({ profile }: { profile: PsychologistProfile | null }) {
  const { form, mutation, submit } = useProfileForm(profile, () => {});

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Controller
        name="displayName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="profile-name">Nama lengkap + gelar</FieldLabel>
            <Input
              {...field}
              id="profile-name"
              placeholder="cth. Dr. Ayu Lestari, M.Psi., Psikolog"
              aria-invalid={fieldState.invalid}
              className="h-11"
            />
            <FieldDescription>Gelar ditulis setelah koma terakhir.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="licenseNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-license">Nomor lisensi</FieldLabel>
              <Input {...field} id="profile-license" aria-invalid={fieldState.invalid} className="h-11" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="sippNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-sipp">Nomor SIPP</FieldLabel>
              <Input {...field} id="profile-sipp" aria-invalid={fieldState.invalid} className="h-11" />
              <FieldDescription>Tercetak di sertifikat setelah tulisan SIPP NO.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="nik"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-nik">NIK</FieldLabel>
              <Input
                {...field}
                id="profile-nik"
                inputMode="numeric"
                placeholder="16 digit angka"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="institutionName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="profile-institution">Asal instansi</FieldLabel>
            <Input {...field} id="profile-institution" aria-invalid={fieldState.invalid} className="h-11" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={mutation.isPending} className="h-11 w-full md:w-auto md:justify-self-end md:px-8">
        {mutation.isPending ? "Menyimpan..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
