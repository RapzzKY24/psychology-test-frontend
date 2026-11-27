"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatIdr } from "@/lib/format/format-idr";
import type { InstansiTestOption } from "../types";
import { MAX_SLOT_LIMIT } from "../constants";
import { useInstansiTests } from "../hooks/use-instansi-tests";
import { useSingleTestCheckout } from "../hooks/use-single-test-checkout";
import { CheckoutStateCard } from "./checkout-state-card";

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

  if (testsQuery.isLoading) return <CheckoutStateCard state="loading" />;

  if (testsQuery.isError) {
    return (
      <CheckoutStateCard
        state="error"
        isRetrying={testsQuery.isFetching}
        onRetry={() => void testsQuery.refetch()}
      />
    );
  }

  if (!test) return <CheckoutStateCard state="unavailable" />;

  return <SingleTestCheckoutForm test={test} />;
}

function SingleTestCheckoutForm({ test }: { test: InstansiTestOption }) {
  const { form, submit, slots, totalAmount, isSubmitting, canSubmit } = useSingleTestCheckout(test);
  const slotError = form.formState.errors.slotLimit;
  // A Rp 0 total can never be paid, so the submit gate stays closed. Say why
  // instead of leaving a dead button.
  const isPriceMissing = test.price <= 0;

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tes yang Dipilih</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium">{test.name}</p>
          <p className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
            <Clock className="size-3" aria-hidden />
            {test.estimatedDurationMin} menit ·
            {test.hasDealPrice ? (
              <>
                <span className="line-through">{formatIdr(test.basePrice)}</span>
                <span className="text-foreground font-medium">{formatIdr(test.price)}</span>
                <Badge variant="secondary">Harga Khusus</Badge>
              </>
            ) : (
              <span>{formatIdr(test.price)}</span>
            )}
            <span>/ peserta</span>
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
              placeholder="Misal 20"
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
                {formatIdr(test.price)} × {slots > 0 ? slots : "…"} peserta
              </p>
            </div>
            <p className="font-heading text-xl font-semibold tabular-nums">
              {formatIdr(totalAmount)}
            </p>
          </div>
          {isPriceMissing && (
            <p role="alert" className="text-destructive text-sm">
              Biaya tes ini belum ditetapkan — hubungi admin sebelum memesan sesi.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isSubmitting ? "Menyimpan…" : "Buat Sesi & Bayar"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
