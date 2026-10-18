"use client";

import { useMutation } from "@tanstack/react-query";
import type { JoinSessionResult } from "@/lib/api/types/sessions";
import { claimSeat } from "../api";

export function useClaimSeat(
  token: string,
  onClaimed: (result: JoinSessionResult) => void,
  onFailed: (error: unknown) => void,
) {
  return useMutation({
    mutationFn: async (participantId: string) => {
      const { data } = await claimSeat(token, participantId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (result) => onClaimed(result),
    onError: (error) => onFailed(error),
  });
}
