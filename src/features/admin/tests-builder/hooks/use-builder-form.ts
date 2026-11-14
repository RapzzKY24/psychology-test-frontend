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
import { archiveTest, publishTest, putInterpretations, putTestItems } from "../api";
import { partitionInterpretations } from "../coverage";
import {
  ChoiceTallyItemContentSchema,
  DiscItemContentSchema,
  LikertItemContentSchema,
  PairItemContentSchema,
  RightWrongItemContentSchema,
  ScaleTallyItemContentSchema,
  normalizeChoiceTallyContent,
  normalizeItemContent,
  normalizeLikertContent,
  normalizePairContent,
  normalizeScaleTallyContent,
  type ChoiceTallyItemContentInput,
  type DiscItemContentInput,
  type LikertItemContentInput,
  type PairItemContentInput,
  type RightWrongItemContentInput,
  type ScaleTallyItemContentInput,
} from "../schemas";

function itemContentSchemaFor(scorerType: string) {
  if (scorerType === "RIGHT_WRONG_NORM") return RightWrongItemContentSchema;
  if (scorerType === "FORCED_CHOICE_PAIR" || scorerType === "PAIR_TALLY") {
    return PairItemContentSchema;
  }
  if (scorerType === "LIKERT") return LikertItemContentSchema;
  if (scorerType === "SCALE_TALLY") return ScaleTallyItemContentSchema;
  if (scorerType === "CHOICE_TALLY") return ChoiceTallyItemContentSchema;
  return DiscItemContentSchema;
}

function getBuilderFormSchema(scorerType: string) {
  const itemContentSchema = itemContentSchemaFor(scorerType);
  return z.object({
    items: z.array(z.object({ content: itemContentSchema })),
    interpretations: z.array(
      z.object({ patternCode: z.string(), title: z.string(), body: z.string() }),
    ),
  });
}

/**
 * A 422 carries the actionable part in `details` ("test must have at least 1
 * item", "items[3]: options.1: …"). Showing only the catalog code leaves the
 * admin guessing, so the first detail replaces the generic copy.
 */
const DETAIL_COPY: Record<string, string> = {
  "test must have at least 1 item": "Tes harus punya minimal 1 soal sebelum dipublish.",
};

export function describeDetail(detail: string): string {
  const known = DETAIL_COPY[detail];
  if (known) return known;
  const item = /^items\[(\d+)\]: (.+)$/.exec(detail);
  if (item) return `Soal #${Number(item[1]) + 1}: ${item[2]}`;
  return detail;
}

export type BuilderFormValues = {
  items: {
    content:
      | ChoiceTallyItemContentInput
      | DiscItemContentInput
      | LikertItemContentInput
      | PairItemContentInput
      | RightWrongItemContentInput
      | ScaleTallyItemContentInput;
  }[];
  interpretations: { patternCode: string; title: string; body: string }[];
};
export type BuilderTab = "soal" | "interpretasi";

function toFormValues(detail: AdminTestDetail): BuilderFormValues {
  return {
    items: detail.items.map((item) => ({
      content:
        detail.scorerType === "RIGHT_WRONG_NORM"
          ? normalizeItemContent(item.content)
          : detail.scorerType === "FORCED_CHOICE_PAIR" || detail.scorerType === "PAIR_TALLY"
            ? normalizePairContent(item.content)
            : detail.scorerType === "LIKERT"
              ? normalizeLikertContent(item.content)
              : detail.scorerType === "SCALE_TALLY"
              ? normalizeScaleTallyContent(item.content)
              : detail.scorerType === "CHOICE_TALLY"
                ? normalizeChoiceTallyContent(item.content)
                : (item.content as DiscItemContentInput),
    })),
    interpretations: detail.interpretations.map((row) => ({
      patternCode: row.patternCode,
      title: row.title,
      body: row.body,
    })),
  };
}

/**
 * The studio's draft form holds the two editor slices (items, interpretations).
 * Settings live in a separate modal with its own PATCH (owner-requested UX).
 * Saves are replace-all on the backend; publish saves first and surfaces 422
 * coverage gaps.
 */
export function useBuilderForm(testId: string, initialData: AdminTestDetail) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<BuilderTab>("soal");
  const [activeItem, setActiveItem] = useState(0);
  // First pattern code of the family; the interpretations tab falls back to the
  // first code that actually exists when this one is not part of the set.
  const [activePattern, setActivePattern] = useState<string>("1");
  const [missingCodes, setMissingCodes] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const formSchema = getBuilderFormSchema(initialData.scorerType);
  const form = useForm<BuilderFormValues>({
    // Dynamic schema (DISC vs RIGHT_WRONG) — cast to any to satisfy Resolver generic
    resolver: zodResolver(formSchema as never) as never,
    defaultValues: toFormValues(initialData),
    mode: "onBlur",
  });

  const itemsArray = useFieldArray({ control: form.control, name: "items" });
  const interpretationsArray = useFieldArray({
    control: form.control,
    name: "interpretations",
  });

  const { dirtyFields } = form.formState;
  const dirtySlices = useMemo(
    () => ({
      items: Array.isArray(dirtyFields.items) && dirtyFields.items.length > 0,
      interpretations:
        Array.isArray(dirtyFields.interpretations) && dirtyFields.interpretations.length > 0,
    }),
    [dirtyFields],
  );
  const dirtyCount = Number(dirtySlices.items) + Number(dirtySlices.interpretations);

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

  /**
   * Saves both slices and returns how many interpretation rows stayed behind.
   * A row with a title but no body (or the reverse) cannot be stored — the
   * backend requires both — so it is re-appended to the form, still dirty,
   * instead of disappearing on the next reload.
   */
  const persistSlices = useCallback(async (): Promise<number> => {
    const values = form.getValues();
    const { complete, partial } = partitionInterpretations(values.interpretations);

    await putTestItems(
      testId,
      values.items.map((item) => ({ content: item.content })),
    );
    await putInterpretations(testId, complete);
    await invalidate();

    // Everything just sent is server-accepted: reset dirty tracking, then put
    // the unfinished rows back so the admin can finish them.
    form.reset({ items: values.items, interpretations: complete });
    partial.forEach((row) => interpretationsArray.append(row, { shouldFocus: false }));

    return partial.length;
  }, [form, testId, invalidate, interpretationsArray]);

  const handleApiError = useCallback((error: unknown) => {
    if (isApiError(error)) {
      if (error.code === "edit_locked") setLocked(true);
      const detail = error.details?.[0];
      toast.error(detail ? describeDetail(detail) : error.message);
      return;
    }
    toast.error("Terjadi kesalahan — coba lagi.");
  }, []);

  const onSave = form.handleSubmit(
    async () => {
      setSaving(true);
      try {
        const leftover = await persistSlices();
        if (leftover > 0) {
          toast.warning(
            `Tersimpan, tapi ${leftover} interpretasi belum lengkap dan belum disimpan.`,
          );
        } else {
          toast.success("Perubahan tersimpan.");
        }
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
          const missingDetail = error.details?.find((d) => d.startsWith("missing pattern codes:"));
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
    scorerType: initialData.scorerType,
    scoringConfig: initialData.scoringConfig,
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
