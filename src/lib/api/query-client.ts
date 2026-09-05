import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "./client";

/**
 * Global conventions (docs/frontend/00-architecture.md §3):
 * - staleTime 30s; retry only for 5xx/network (never 4xx).
 * - QueryCache/MutationCache onError → toast Indonesian copy (from ApiError).
 * - Opt out per query/mutation with `meta: { silentError: true }` and handle locally.
 * - 401 → invalidate + kick to /masuk (rare path; full reload is acceptable).
 */

function handleGlobalError(error: unknown, silent: boolean) {
  if (silent) return;
  if (isApiError(error) && error.isUnauthorized) {
    toast.error(error.message);
    // Deliberate full reload outside React context (QueryClient has no router):
    // session is gone, so a fresh app shell + /masuk is the safest reset.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/masuk");
    return;
  }
  toast.error(error instanceof Error ? error.message : "Terjadi kesalahan — coba lagi.");
}

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => handleGlobalError(error, query.meta?.silentError === true),
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) =>
        handleGlobalError(error, mutation.meta?.silentError === true),
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (isApiError(error) && error.statusCode < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });
}
