"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import type { AdminTest, AdminTestDetail, TestCategory } from "@/lib/api/types";
import { updateTest } from "../api";
import { TestSettingsSchema } from "../schemas";
import { CoverImageUpload } from "./cover-image-upload";
import type { TestSettingsInput } from "../schemas";

const CATEGORY_LABEL: Record<TestCategory, string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

interface SettingsModalProps {
  detail: AdminTestDetail;
  locked: boolean;
  /** Receives the updated test — the header updates its displayed name. */
  onSaved: (updated: AdminTest) => void;
  children: React.ReactNode; // trigger
}

export function SettingsModal({ detail, locked, onSaved, children }: SettingsModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<TestSettingsInput>({
    resolver: zodResolver(TestSettingsSchema),
    defaultValues: {
      name: detail.name,
      slug: detail.slug,
      description: detail.description,
      category: detail.category,
      price: detail.price,
      estimatedDurationMin: detail.estimatedDurationMin,
    },
  });

  // Re-sync defaults each time the modal opens (and after external refetches).
  useEffect(() => {
    form.reset({
      name: detail.name,
      slug: detail.slug,
      description: detail.description,
      category: detail.category,
      price: detail.price,
      estimatedDurationMin: detail.estimatedDurationMin,
    });
  }, [detail, form]);

  const mutation = useMutation({
    mutationFn: async (values: TestSettingsInput) => {
      const { data } = await updateTest(detail.id, values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
      toast.success("Pengaturan tes tersimpan.");
      onSaved(updated);
    },
    onError: (error) => {
      if (isApiError(error) && error.code === "slug already exists") {
        form.setError("slug", { message: "Slug sudah dipakai tes lain." });
        return;
      }
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pengaturan Tes</DialogTitle>
          <DialogDescription>
            Nama, slug, dan detail katalog. Soal dan interpretasi diedit di tab masing-masing.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(
            (values) => mutation.mutateAsync(values),
            () => toast.error("Periksa kembali field yang bertanda merah."),
          )}
          noValidate
          className="grid gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="settings-name">Nama tes</FieldLabel>
                <Input
                  {...field}
                  id="settings-name"
                  disabled={locked}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="settings-slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="settings-slug"
                  disabled={locked}
                  onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Dipakai di URL katalog publik.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="settings-description">Deskripsi</FieldLabel>
                <Textarea
                  {...field}
                  id="settings-description"
                  rows={3}
                  disabled={locked}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <CoverImageUpload
            testId={detail.id}
            value={detail.imageUrl}
            disabled={locked}
            onChanged={(updated) => {
              void queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
              void queryClient.invalidateQueries({
                queryKey: qk.admin.tests.detail(detail.id),
              });
              onSaved(updated);
            }}
          />
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-category">Kategori</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={locked}>
                    <SelectTrigger id="settings-category" aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-price">Harga (Rp)</FieldLabel>
                  <Input
                    {...field}
                    id="settings-price"
                    type="number"
                    min={0}
                    disabled={locked}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="estimatedDurationMin"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="settings-duration">Durasi (menit)</FieldLabel>
                  <Input
                    {...field}
                    id="settings-duration"
                    type="number"
                    min={1}
                    disabled={locked}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending || locked}>
              {mutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
