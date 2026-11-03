"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import type { AdminTest, AdminTestDetail } from "@/lib/api/types";
import { updateTest } from "../api";
import { TestSettingsSchema } from "../schemas";
import type { TestSettingsInput } from "../schemas";
import { CoverImageUpload } from "./cover-image-upload";
import { SettingsFields } from "./settings-fields";
import { SettingsMetaFields } from "./settings-meta-fields";

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
      scorerType: detail.scorerType,
      price: detail.price,
      estimatedDurationMin: detail.estimatedDurationMin,
      timeLimitMin: detail.timeLimitMin ?? 0,
    },
  });

  // Re-sync defaults each time the modal opens (and after external refetches).
  useEffect(() => {
    form.reset({
      name: detail.name,
      slug: detail.slug,
      description: detail.description,
      category: detail.category,
      scorerType: detail.scorerType,
      price: detail.price,
      estimatedDurationMin: detail.estimatedDurationMin,
      timeLimitMin: detail.timeLimitMin ?? 0,
    });
  }, [detail, form]);

  const mutation = useMutation({
    mutationFn: async ({ timeLimitMin, ...values }: TestSettingsInput) => {
      const { data } = await updateTest(detail.id, {
        ...values,
        timeLimitMin: timeLimitMin > 0 ? timeLimitMin : null,
      });
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
          <SettingsFields control={form.control} locked={locked} />
          <SettingsMetaFields
            control={form.control}
            locked={locked}
            scorerEditable={detail.status === "DRAFT" && detail.items.length === 0}
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
