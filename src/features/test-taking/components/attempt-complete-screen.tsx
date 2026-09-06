"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Post-complete state: results are PENDING_REVIEW — the psychologist is the
 * single release gate (ADR-007), so nothing about scores is shown here.
 */
export function AttemptCompleteScreen({ homeHref }: { homeHref: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <CircleCheck className="size-12 text-primary" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">Tes selesai</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Jawaban kamu sudah terkirim dan sedang menunggu review psikolog. Hasil akan tersedia di
        dashboard setelah disetujui.
      </p>
      <Button asChild>
        <Link href={homeHref}>Kembali</Link>
      </Button>
    </main>
  );
}
