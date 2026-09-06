"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import type { JoinSessionResult } from "@/lib/api/types/sessions";
import { joinSession } from "../api";
import type { JoinSessionPayload } from "../schemas";

export function useJoinSession(
  token: string,
  onJoined: (result: JoinSessionResult) => void,
  onFailed: (message: string) => void,
) {
  return useMutation({
    mutationFn: async (values: JoinSessionPayload) => {
      const { data } = await joinSession(token, values);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (result) => onJoined(result),
    onError: (error) => {
      if (isApiError(error)) {
        onFailed(error.message);
        return;
      }
      onFailed(GENERIC_ERROR_MESSAGE);
    },
  });
}
