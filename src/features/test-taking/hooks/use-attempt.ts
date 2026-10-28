"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/query-keys";
import { fetchAttempt } from "../api";

/** Loads the sanitized attempt (items without mapping) for the runner. */
export function useAttempt(attemptId: string, participantToken: string | null) {
  return useQuery({
    queryKey: qk.attempts.detail(attemptId),
    queryFn: () => fetchAttempt(attemptId, participantToken ?? undefined),
    // The runner is the source of truth while it is mounted — no refetch
    // that could clobber in-flight answers.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });
}
