"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api/client";
import type { MeProfile } from "@/lib/api/types";
import { updateMeProfile } from "../api.client";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(120, "Nama maksimal 120 karakter."),
  phone: z
    .string()
    .trim()
    .max(30, "Nomor maksimal 30 karakter.")
    .refine(
      (value) => value === "" || /^[0-9+\-\s()]+$/.test(value),
      "Gunakan angka, spasi, +, -, atau tanda kurung.",
    ),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({ profile }: { profile: MeProfile }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: profile.name, phone: profile.phone ?? "" },
  });

  const mutation = useMutation({
    mutationFn: updateMeProfile,
    onSuccess: (response) => {
      toast.success("Profil tersimpan.");
      form.reset({ name: response.data.name, phone: response.data.phone ?? "" });
      // The top bar reads the name from the server session.
      router.refresh();
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : "Profil gagal disimpan.");
    },
  });

  const submit = form.handleSubmit((values) => {
    mutation.mutate({ name: values.name, phone: values.phone === "" ? null : values.phone });
  });

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-name">Nama lengkap</FieldLabel>
              <Input
                {...field}
                id="profile-name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-phone">Nomor WhatsApp</FieldLabel>
              <Input
                {...field}
                id="profile-phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="cth. 0812 3456 7890"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              <FieldDescription>
                Dipakai untuk mengirim hasil dan sertifikat lewat WhatsApp.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Field>
        <FieldLabel htmlFor="profile-email">Email</FieldLabel>
        <Input id="profile-email" value={profile.email} disabled readOnly className="h-11" />
        <FieldDescription>
          Email dipakai untuk masuk dan tidak bisa diubah di sini.
        </FieldDescription>
      </Field>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="h-11 w-full sm:w-auto sm:justify-self-end sm:px-8"
      >
        {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
