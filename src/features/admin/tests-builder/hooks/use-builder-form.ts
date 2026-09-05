"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { isApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import type { AdminTestDetail } from "@/lib/api/types";
import { archiveTest, publishTest, putInterpretations, putTestItems, updateTest } from "../api";
import { DiscItemContentSchema, TestSettingsSchema } from "../schemas";

const BuilderFormSchema = z.object({
  settings: TestSettingsSchema,
  items: z.array(z.object({ content: DiscItemContentSchema })),
  interpretations: z.array(
    z.object({ patternCode: z.string(), title: z.string(), body: z.string() }),
  ),
});

export type BuilderFormValues = z.infer<typeof BuilderFormSchema>;
export type BuilderTab = "pengaturan" | "soal" | "interpretasi";

function toFormValues(detail: AdminTestDetail): BuilderFormValues {
  return {
    settings: {
      name: detail.name,
      slug: detail.slug,
      description: detail.description,
      category: detail.category,
      price: detail.price,
      estimatedDurationMin: detail.estimatedDurationMin,
    },
    items: detail.items.map((item) => ({ content: item.content })),
    interpretations: detail.interpretations.map((row) => ({
      patternCode: row.patternCode,
      title: row.title,
      body: row.body,
    })),
  };
}

/**
 * The studio's single form holds all three draft slices (settings, items,
 * interpretations). Saves are replace-all on the backend, so Simpan sends the
 * dirty slices' full state; publish saves first and surfaces 422 coverage gaps.
 */
export function useBuilderForm(testId: string, initialData: AdminTestDetail) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<BuilderTab>("pengaturan");
  const [activeItem, setActiveItem] = useState(0);
  const [activePattern, setActivePattern] = useState<string>("1");
  const [missingCodes, setMissingCodes] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<BuilderFormValues>({
    resolver: zodResolver(BuilderFormSchema),
    defaultValues: toFormValues(initialData),
    mode: "onBlur",
  });

  const itemsArray = useFieldArray({ control: form.control, name: "items" });
  const interpretationsArray = useFieldArray({
    control: form.control,
    name: "interpretations",
  });

  const { dirtyFields } = form.formState;
  const dirtySlices = useMemo(() => {
    const settings = Object.keys(dirtyFields.settings ?? {}).length > 0;
    const items = Array.isArray(dirtyFields.items) && dirtyFields.items.length > 0;
    const interpretations =
      Array.isArray(dirtyFields.interpretations) && dirtyFields.interpretations.length > 0;
    return { settings, items, interpretations };
  }, [dirtyFields]);
  const dirtyCount =
    Number(dirtySlices.settings) + Number(dirtySlices.items) + Number(dirtySlices.interpretations);

  // Warn before closing the tab with unsaved changes (App Router has no
  // in-app navigation blocker — the Simpan ●N badge covers in-app awareness).
  useEffect(() => {
    if (dirtyCount === 0) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyCount]);

  const invalidate = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: qk.admin.tests.all });
  }, [queryClient]);

  const persistSlices = useCallback(async () => {
    const values = form.getValues();
    await updateTest(testId, values.settings);
    await putTestItems(
      testId,
      values.items.map((item) => ({ content: item.content })),
    );
    await putInterpretations(
      testId,
      values.interpretations.filter((row) => row.title.trim() && row.body.trim()),
    );
    await invalidate();
    // Current values are now server-accepted: reset dirty tracking.
    form.reset(form.getValues());
  }, [form, testId, invalidate]);

  const handleApiError = useCallback((error: unknown) => {
    if (isApiError(error)) {
      if (error.code === "edit_locked") setLocked(true);
      toast.error(error.message);
      return;
    }
    toast.error("Terjadi kesalahan — coba lagi.");
  }, []);

  const onSave = form.handleSubmit(
    async () => {
      setSaving(true);
      try {
        await persistSlices();
        toast.success("Perubahan tersimpan.");
      } catch (error) {
        handleApiError(error);
      } finally {
        setSaving(false);
      }
    },
    () => toast.error("Periksa kembali field yang bertanda merah."),
  );

  const onPublish = form.handleSubmit(
    async () => {
      setSaving(true);
      try {
        await persistSlices();
        await publishTest(testId);
        setMissingCodes([]);
        toast.success("Tes dipublikasikan.");
        await invalidate();
      } catch (error) {
        if (isApiError(error)) {
          const missingDetail = error.details?.find((d) =>
            d.startsWith("missing pattern codes:"),
          );
          if (missingDetail) {
            const codes = missingDetail
              .replace("missing pattern codes: ", "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            setMissingCodes(codes);
            setTab("interpretasi");
            toast.error(`Lengkapi ${codes.length} interpretasi yang belum terisi.`);
            return;
          }
        }
        handleApiError(error);
      } finally {
        setSaving(false);
      }
    },
    () => toast.error("Periksa kembali field yang bertanda merah."),
  );

  const onArchive = useCallback(async () => {
    try {
      await archiveTest(testId);
      toast.success("Tes diarsipkan.");
      await invalidate();
      router.push("/admin/tes");
    } catch (error) {
      handleApiError(error);
    }
  }, [testId, invalidate, router, handleApiError]);

  return {
    form,
    itemsArray,
    interpretationsArray,
    tab,
    setTab,
    activeItem,
    setActiveItem,
    activePattern,
    setActivePattern,
    missingCodes,
    locked,
    saving,
    dirtySlices,
    dirtyCount,
    onSave,
    onPublish,
    onArchive,
  };
}

export type BuilderController = ReturnType<typeof useBuilderForm>;
