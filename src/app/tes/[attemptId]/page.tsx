"use client";

import { useParams, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttemptRunner } from "@/features/test-taking/components/attempt-runner";
import { useAttempt } from "@/features/test-taking/hooks/use-attempt";
import { isApiError } from "@/lib/api/client";
import { getGuestTokenForAttempt } from "@/lib/guest-token";

const emptySubscribe = () => () => {};

/**
 * Shared runner route for guest (localStorage token) and logged-in
 * participants (cookie). Client-side fetch is required for guests because
 * the participant token never leaves the browser (ADR-010).
 */
export default function TesPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;
  const router = useRouter();

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

  const attempt = query.data.data;

  return <AttemptRunner attempt={attempt} participantToken={token} homeHref="/" />;
}
