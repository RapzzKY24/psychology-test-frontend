"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { ReportDraftPayload, ReportFormData } from "@/lib/api/types";
import { issueReport, saveReportDraft } from "../api";

function toastError(error: unknown) {
  toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
}

/** PUT merges, so a partial save never wipes what is already stored. */
export function useSaveReportDraft(
  participantId: string,
  onSaved: (readiness: ReportFormData["readiness"]) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ReportDraftPayload) => {
      const { data } = await saveReportDraft(participantId, payload);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      onSaved(data.readiness);
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reports.all });
      toast.success("Draf laporan tersimpan.");
    },
    onError: toastError,
  });
}

/** Irreversible: the number is assigned and the snapshot frozen. */
export function useIssueReport(participantId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await issueReport(participantId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.reports.all });
      toast.success(`Laporan ${data.number} diterbitkan.`);
      router.refresh();
    },
    onError: (error) => {
      // 422 report_not_ready carries the field list — show what is missing.
      if (isApiError(error) && error.code === "report_not_ready" && error.details?.length) {
        toast.error(`Laporan belum lengkap: ${error.details.slice(0, 3).join(", ")}`);
        return;
      }
      toastError(error);
    },
  });
}
