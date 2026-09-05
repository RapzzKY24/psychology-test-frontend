"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { TEST_CATEGORIES } from "@/lib/api/types";
import { createTest } from "../api";
import { CreateTestSchema, slugify } from "../schemas";
import type { CreateTestInput } from "../schemas";

const CATEGORY_LABEL: Record<(typeof TEST_CATEGORIES)[number], string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

export function CreateTestButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const form = useForm<CreateTestInput>({
    resolver: zodResolver(CreateTestSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "PERSONALITY",
      scorerType: "FORCED_CHOICE_DISC",
      price: 0,
      estimatedDurationMin: 20,
    },
  });

  const name = form.watch("name");
  useEffect(() => {
    if (!slugEdited) {
      form.setValue("slug", slugify(name), { shouldDirty: true });
    }
  }, [name, slugEdited, form]);

  const mutation = useMutation({
    mutationFn: async (values: CreateTestInput) => {
      const { data } = await createTest(values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (created) => {
      toast.success("Tes dibuat — lengkapi soal dan interpretasi.");
      void queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
      setOpen(false);
      form.reset();
      setSlugEdited(false);
      router.push(`/admin/tes/${created.id}`);
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          form.reset();
          setSlugEdited(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Tes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Tes Baru</DialogTitle>
          <DialogDescription>
            Tes lahir sebagai DRAFT — lengkapi soal dan interpretasi sebelum publish.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutation.mutateAsync(v))} noValidate className="grid gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Nama tes</FieldLabel>
                <Input {...field} id="name" placeholder="DISC Form A" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="slug"
                  placeholder="disc-form-a"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    setSlugEdited(true);
                    field.onChange(e.target.value.toLowerCase());
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  rows={3}
                  placeholder="Deskripsi tes untuk katalog."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Kategori</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CATEGORY_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Harga (Rp)</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    min={0}
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
                  <FieldLabel htmlFor="duration">Durasi (menit)</FieldLabel>
                  <Input
                    {...field}
                    id="duration"
                    type="number"
                    min={1}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Buat Tes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
