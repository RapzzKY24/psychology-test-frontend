"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { Gender } from "@/lib/api/types";
import { fetchAttempt } from "../api";

/**
 * Loads the sanitized attempt (items without mapping) for the runner.
 *
 * `birthDate` and `gender` are part of the key on purpose: a banded or gendered
 * test answers `birth_date_required` / `gender_required` until the participant
 * declares the value, and re-running the query with it is what unlocks the
 * attempt (and, for RMIB, picks the occupation list).
 */
export function useAttempt(
  attemptId: string,
  participantToken: string | null,
  birthDate: string | null = null,
  gender: Gender | null = null,
) {
  return useQuery({
    queryKey: [...qk.attempts.detail(attemptId), birthDate, gender],
    queryFn: () => fetchAttempt(attemptId, participantToken ?? undefined, birthDate, gender),
    // The runner is the source of truth while it is mounted — no refetch
    // that could clobber in-flight answers.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });
}
