"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PUBLIC_COPY } from "../copy";
import { VerificationCodeSchema } from "../schemas";
import type { VerificationCodeInput } from "../schemas";

interface VerificationLookupProps {
  className?: string;
  autoFocus?: boolean;
}

/**
 * The code only routes to /verifikasi/[code]; the page decides whether it is a
 * report, a certificate, or nothing. No API call happens here.
 */
export function VerificationLookup({ className, autoFocus = false }: VerificationLookupProps) {
  const router = useRouter();
  const form = useForm<VerificationCodeInput>({
    resolver: zodResolver(VerificationCodeSchema),
    defaultValues: { code: "" },
  });

  const submit = form.handleSubmit(({ code }) => {
    router.push(`/verifikasi/${encodeURIComponent(code.trim().toUpperCase())}`);
  });

  return (
    <form onSubmit={submit} noValidate className={cn("grid gap-3", className)}>
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="verification-code">
              {PUBLIC_COPY.verification.lookupLabel}
            </FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                {...field}
                id="verification-code"
                autoFocus={autoFocus}
                autoComplete="off"
                placeholder={PUBLIC_COPY.verification.lookupPlaceholder}
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              <Button type="submit" className="h-11 shrink-0">
                {PUBLIC_COPY.verification.lookupSubmit}
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
