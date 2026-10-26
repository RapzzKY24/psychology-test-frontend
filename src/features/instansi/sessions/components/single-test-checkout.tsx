"use client";

import Link from "next/link";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIdr } from "@/lib/format/format-idr";
import type { InstansiTestOption } from "../api";
import { MAX_SLOT_LIMIT } from "../constants";
import { useInstansiTests } from "../hooks/use-instansi-tests";
import { useSingleTestCheckout } from "../hooks/use-single-test-checkout";

interface SingleTestCheckoutProps {
  testId: string;
  /** RSC result; undefined when the server fetch failed (client retries). */
  initialTests?: InstansiTestOption[];
}

/**
 * Catalog checkout for institutions: the test comes from the URL, so the page
 * only asks how many people the batch is for and shows the prepaid total.
 */
export function SingleTestCheckout({ testId, initialTests }: SingleTestCheckoutProps) {
  const testsQuery = useInstansiTests(initialTests);
  const test = testsQuery.data?.find((option) => option.id === testId);

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
          <p className="text-muted-foreground text-sm">Gagal memuat data tes.</p>
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

  if (!test) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="text-destructive size-6" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium">Tes tidak tersedia</p>
            <p className="text-muted-foreground text-sm">
              Tes ini belum dijual atau sudah diarsipkan.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tes">Kembali ke katalog</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <SingleTestCheckoutForm test={test} />;
}

function SingleTestCheckoutForm({ test }: { test: InstansiTestOption }) {
  const { form, submit, slots, totalAmount, isSubmitting, canSubmit } = useSingleTestCheckout(test);
  const slotError = form.formState.errors.slotLimit;

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tes yang Dipilih</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium">{test.name}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <Clock className="size-3" aria-hidden />
            {test.estimatedDurationMin} menit · {formatIdr(test.price)} / peserta
          </p>
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
              Slot dibayar di muka; maksimal {MAX_SLOT_LIMIT} peserta per sesi. Nama peserta
              dilengkapi dari dashboard setelah pembayaran.
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
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase">Total</p>
              <p className="text-muted-foreground text-xs">
                {formatIdr(test.price)} × {slots} peserta
              </p>
            </div>
            <p className="font-heading text-xl font-semibold tabular-nums">
              {formatIdr(totalAmount)}
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isSubmitting ? "Menyimpan…" : "Buat Sesi & Bayar"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
