"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Shown when a test's norm is age-banded and the attempt has no birth date yet.
 * The API rejects the attempt read with `birth_date_required`, so this screen
 * is the only way forward; the date is stored server-side on first success.
 */
export function AttemptAgeGate({
  invalid,
  initialValue = "",
  onSubmit,
}: {
  invalid: boolean;
  /** Keeps the typed date after the failed attempt re-renders this screen. */
  initialValue?: string;
  onSubmit: (birthDate: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <span className="bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-lg">
            <CalendarCheck className="size-4" aria-hidden />
          </span>
          <CardTitle>Konfirmasi usia peserta</CardTitle>
          <CardDescription>
            Tes ini memakai norma yang hanya berlaku untuk rentang usia tertentu. Masukkan tanggal
            lahir peserta untuk melanjutkan.
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
            <div className="grid gap-2">
              <Label htmlFor="attempt-birth-date">Tanggal lahir peserta</Label>
              <Input
                id="attempt-birth-date"
                type="date"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </div>
            {invalid && (
              <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-sm">
                Tanggal lahir tidak valid — periksa kembali.
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

/** The stored age is outside the band the norm was built for. */
export function AttemptAgeBlocked() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <span className="border-destructive/30 bg-destructive/5 text-destructive mb-2 flex size-9 items-center justify-center rounded-lg border">
            <ShieldAlert className="size-4" aria-hidden />
          </span>
          <CardTitle>Usia peserta di luar rentang norma</CardTitle>
          <CardDescription>
            Hasil tes ini hanya berlaku untuk peserta pada rentang usia yang ditetapkan normanya.
            Hubungi penyelenggara sesi untuk informasi lebih lanjut.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
