"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import type { Education, Gender } from "@/lib/api/types";
import { fetchAttempt } from "../api";

/**
 * Loads the sanitized attempt (items without mapping) for the runner.
 *
 * `birthDate`, `gender` and `education` are part of the key on purpose: a
 * banded, gendered or education-banded test answers `birth_date_required` /
 * `gender_required` / `education_required` until the participant declares the
 * value, and re-running the query with it is what unlocks the attempt (and, for
 * RMIB, picks the occupation list; for 16PF, the sten table).
 */
export function useAttempt(
  attemptId: string,
  participantToken: string | null,
  birthDate: string | null = null,
  gender: Gender | null = null,
  education: Education | null = null,
  /**
   * A guest's token only exists in localStorage, which the server render and
   * the hydration pass cannot read. Starting the fetch before that pass is over
   * would call the signed-in route with no token, take a 401 and bounce the
   * participant to /masuk — so the caller holds the query until it is mounted.
   */
  enabled = true,
) {
  return useQuery({
    queryKey: [...qk.attempts.detail(attemptId), participantToken, birthDate, gender, education],
    queryFn: () =>
      fetchAttempt(attemptId, participantToken ?? undefined, birthDate, gender, education),
    enabled,
    // `*_required` is an expected answer, not a failure: the island turns it
    // into a gate screen. A global error toast on top of that reads as a bug.
    meta: { silentError: true },
    // The runner is the source of truth while it is mounted — no refetch
    // that could clobber in-flight answers.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });
}
