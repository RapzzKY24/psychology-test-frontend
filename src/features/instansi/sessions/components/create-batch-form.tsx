"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { InstansiTestOption } from "../api";
import { MAX_SLOT_LIMIT } from "../constants";
import { useCreateBatchForm } from "../hooks/use-create-batch-form";
import { useInstansiTests } from "../hooks/use-instansi-tests";
import { BatchSummary } from "./batch-summary";
import { BatchTestPicker } from "./batch-test-picker";

interface CreateBatchFormProps {
  /** RSC result; undefined when the server fetch failed (client retries). */
  initialTests?: InstansiTestOption[];
  initialTestId?: string;
}

/**
 * Checkout island: pick tests, set the slot count, review the prepaid total,
 * then create the batch and land on its invoice.
 */
export function CreateBatchForm({ initialTests, initialTestId }: CreateBatchFormProps) {
  const testsQuery = useInstansiTests(initialTests);
  const tests = testsQuery.data ?? [];
  const { form, submit, toggleTest, selectedTests, slots, totalAmount, isSubmitting, canSubmit } =
    useCreateBatchForm({ tests, initialTestId });

  if (testsQuery.isLoading) {
    return (
      <Card>
        <CardContent className="space-y-2 py-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (testsQuery.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="text-destructive size-6" aria-hidden />
          <p className="text-muted-foreground text-sm">Gagal memuat daftar tes.</p>
          <Button
            variant="outline"
            onClick={() => void testsQuery.refetch()}
            disabled={testsQuery.isFetching}
          >
            {testsQuery.isFetching ? "Memuat…" : "Coba lagi"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const slotError = form.formState.errors.slotLimit;

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih Tes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <BatchTestPicker
            tests={tests}
            selectedIds={form.watch("testIds")}
            onToggle={toggleTest}
          />
          <FieldError>{form.formState.errors.testIds?.message}</FieldError>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jumlah Peserta (Slot)</CardTitle>
        </CardHeader>
        <CardContent>
          <Field data-invalid={Boolean(slotError)}>
            <FieldLabel htmlFor="slotLimit">Jumlah slot</FieldLabel>
            <Input
              id="slotLimit"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_SLOT_LIMIT}
              aria-invalid={Boolean(slotError)}
              {...form.register("slotLimit", { valueAsNumber: true })}
            />
            <FieldDescription>
              Slot dibayar di muka; maksimal {MAX_SLOT_LIMIT} peserta per sesi.
            </FieldDescription>
            <FieldError>{slotError?.message}</FieldError>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BatchSummary selectedTests={selectedTests} slots={slots} totalAmount={totalAmount} />
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isSubmitting ? "Menyimpan…" : "Buat Sesi & Bayar"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
