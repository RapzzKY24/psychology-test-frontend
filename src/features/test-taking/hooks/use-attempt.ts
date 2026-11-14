"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchAttempt } from "../api";

/**
 * Loads the sanitized attempt (items without mapping) for the runner.
 *
 * `birthDate` is part of the key on purpose: a banded test answers
 * `birth_date_required` until the participant declares one, and re-running the
 * query with the date is what unlocks the attempt.
 */
export function useAttempt(
  attemptId: string,
  participantToken: string | null,
  birthDate: string | null = null,
) {
  return useQuery({
    queryKey: [...qk.attempts.detail(attemptId), birthDate],
    queryFn: () => fetchAttempt(attemptId, participantToken ?? undefined, birthDate),
    // The runner is the source of truth while it is mounted — no refetch
    // that could clobber in-flight answers.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });
}
