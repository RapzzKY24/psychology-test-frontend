"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttemptRunner } from "./attempt-runner";
import { useAttempt } from "../hooks/use-attempt";
import { isApiError } from "@/lib/api/client";
import { getGuestTokenForAttempt } from "@/lib/guest-token";

const emptySubscribe = () => () => {};

/**
 * Guest participants keep their token in localStorage, so the attempt has to
 * be fetched in the browser — this island owns that fetch and every state
 * below it, while the route stays a server component (ADR-010).
 */
export function AttemptRunnerIsland({ attemptId }: { attemptId: string }) {
  // Hydration-safe "mounted" flag + one-shot localStorage token read.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const token = mounted ? getGuestTokenForAttempt(attemptId) : null;

  const query = useAttempt(attemptId, mounted ? token : null);

  if (!mounted || query.isPending) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </main>
    );
  }

  if (query.isError) {
    const unauthorized = isApiError(query.error) && query.error.isUnauthorized;
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{unauthorized ? "Sesi tes tidak valid" : "Terjadi kesalahan"}</CardTitle>
            <CardDescription>
              {unauthorized
                ? "Token pengerjaan tidak ditemukan atau sudah tidak berlaku. Buka kembali tautan undangan untuk bergabung."
                : "Coba muat ulang halaman, atau kembali lagi nanti."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/">Kembali ke beranda</Link>
            </Button>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          Sudah pernah join? Token tersimpan di perangkat ini — coba buka ulang tautan yang sama.
        </p>
      </main>
    );
  }

  return <AttemptRunner attempt={query.data.data} participantToken={token} homeHref="/" />;
}
