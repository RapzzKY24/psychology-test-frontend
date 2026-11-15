"use client";

import { useState } from "react";
import { UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Gender } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Laki-laki" },
  { value: "FEMALE", label: "Perempuan" },
];

/**
 * Shown when the instrument needs the participant's sex before it can be
 * scored — RMIB prints two item lists, 16PF reads a different sten table. The
 * API rejects the read with `gender_required`, so this screen is the only way
 * forward; the value is stored server-side on the first successful read and
 * cannot be changed afterwards.
 */
export function AttemptGenderGate({
  invalid,
  initialValue = null,
  onSubmit,
}: {
  invalid: boolean;
  /** Keeps the pick after the failed attempt re-renders this screen. */
  initialValue?: Gender | null;
  onSubmit: (gender: Gender) => void;
}) {
  const [value, setValue] = useState<Gender | null>(initialValue);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <span className="bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-lg">
            <UserRoundCheck className="size-4" aria-hidden />
          </span>
          <CardTitle>Konfirmasi jenis kelamin peserta</CardTitle>
          <CardDescription>
            Tes ini memakai materi dan norma yang berbeda untuk laki-laki dan perempuan. Pilih
            jenis kelamin peserta supaya penilaiannya tepat — pilihan ini tidak bisa diubah
            setelah tes dimulai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (value) onSubmit(value);
            }}
          >
            <div className="grid gap-2" role="radiogroup" aria-label="Jenis kelamin peserta">
              {OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={value === option.value}
                  onClick={() => setValue(option.value)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                    value === option.value
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/60",
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            {invalid && (
              <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-sm">
                Jenis kelamin tidak valid — pilih salah satu.
              </p>
            )}
            <Button type="submit" disabled={!value} className="w-full rounded-full">
              Lanjutkan
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
