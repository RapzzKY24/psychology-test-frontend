"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttemptAgeBlocked, AttemptAgeGate } from "./attempt-age-gate";
import { AttemptEducationGate } from "./attempt-education-gate";
import { AttemptGenderGate } from "./attempt-gender-gate";
import { AttemptRunner } from "./attempt-runner";
import { MultiSubtestRunner } from "./multi-subtest-runner";
import { useAttempt } from "../hooks/use-attempt";
import { resolveScorerType } from "../registry";
import { isApiError } from "@/lib/api/client";
import { getGuestTokenForAttempt } from "@/lib/guest-token";
import type { Education, Gender } from "@/lib/api/types";

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

  // The API stores the first date it accepts, so this only has to survive the
  // retry that unlocks a banded attempt. Same for the declared sex and schooling.
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [education, setEducation] = useState<Education | null>(null);
  const query = useAttempt(
    attemptId,
    mounted ? token : null,
    birthDate,
    gender,
    education,
  );

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
    if (isApiError(query.error)) {
      if (query.error.code === "birth_date_required" || query.error.code === "birth_date_invalid") {
        return (
          <AttemptAgeGate
            invalid={query.error.code === "birth_date_invalid"}
            initialValue={birthDate ?? ""}
            onSubmit={setBirthDate}
          />
        );
      }
      if (query.error.code === "age_out_of_band") {
        return <AttemptAgeBlocked />;
      }
      if (query.error.code === "gender_required" || query.error.code === "gender_invalid") {
        return (
          <AttemptGenderGate
            invalid={query.error.code === "gender_invalid"}
            initialValue={gender}
            onSubmit={setGender}
          />
        );
      }
      if (
        query.error.code === "education_required" ||
        query.error.code === "education_invalid"
      ) {
        return (
          <AttemptEducationGate
            invalid={query.error.code === "education_invalid"}
            initialValue={education}
            onSubmit={setEducation}
          />
        );
      }
    }

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

  // A battery closes its own subtests, so it owns its screen: the generic
  // runner would let the participant walk into a window that already shut.
  if (resolveScorerType(attempt) === "MULTI_SUBTEST") {
    return <MultiSubtestRunner attempt={attempt} participantToken={token} homeHref="/" />;
  }

  return <AttemptRunner attempt={attempt} participantToken={token} homeHref="/" />;
}