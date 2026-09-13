"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PsychologistProfile } from "@/lib/api/types";
import { useProfileForm } from "@/features/psikolog/profil/hooks/use-profile-form";

export function ProfileForm({ profile }: { profile: PsychologistProfile | null }) {
  const { form, mutation, submit } = useProfileForm(profile, () => {});

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-name">Nama lengkap + gelar</FieldLabel>
              <Input {...field} id="profile-name" aria-invalid={fieldState.invalid} className="h-11" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="degree"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-degree">Gelar</FieldLabel>
              <Input {...field} id="profile-degree" placeholder="cth. M.Psi., Psikolog" aria-invalid={fieldState.invalid} className="h-11" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="licenseNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-license">Nomor lisensi (SIPP)</FieldLabel>
              <Input {...field} id="profile-license" aria-invalid={fieldState.invalid} className="h-11" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="profile-nik">NIK</FieldLabel>
          <Input id="profile-nik" value={profile?.nik ?? "—"} disabled className="h-11" />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="profile-institution">Asal instansi</FieldLabel>
        <Input
          id="profile-institution"
          value={profile?.institutionName ?? "—"}
          disabled
          className="h-11"
        />
      </Field>
      <Button type="submit" disabled={mutation.isPending} className="h-11 w-full md:w-auto md:justify-self-end md:px-8">
        {mutation.isPending ? "Menyimpan..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
