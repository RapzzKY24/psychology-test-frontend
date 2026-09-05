"use client";

import { useCallback } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Optimistic plumbing for admin tables (ADR-010 pattern: lists live in the
 * React Query cache via client islands fed RSC initialData).
 *
 * Flow per mutation:
 *   begin()          — cancel in-flight refetches, snapshot the list
 *   patch(updater)   — write optimistic rows (marked `_optimistic` → grayed)
 *   rollback()       — restore the snapshot on failure
 *   refetch()        — onSettled: let the server response replace everything
 */
export function useOptimisticList<T extends object>(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  const begin = useCallback(() => {
    void queryClient.cancelQueries({ queryKey });
    const snapshot = queryClient.getQueryData(queryKey);
    return () => {
      if (snapshot) queryClient.setQueryData(queryKey, snapshot);
    };
  }, [queryClient, queryKey]);

  const patch = useCallback(
    (update: (rows: T[]) => T[]) => {
      queryClient.setQueryData<ApiSuccessLike<T>>(queryKey, (current) =>
        current ? { ...current, data: update(current.data) } : current,
      );
    },
    [queryClient, queryKey],
  );

  const refetch = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { begin, patch, refetch };
}

interface ApiSuccessLike<T> {
  data: T[];
  meta?: unknown;
  message?: string;
}

export type OptimisticRow<T> = T & { _optimistic?: boolean };

/** Marks a row as being saved (tables render it grayed + "menyimpan…"). */
export function asOptimistic<T extends object>(row: T): OptimisticRow<T> {
  return { ...row, _optimistic: true };
}

export function isOptimistic<T extends object>(row: OptimisticRow<T>): boolean {
  return row._optimistic === true;
}
