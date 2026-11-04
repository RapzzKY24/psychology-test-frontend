"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { CertificateFormData, CertificatePayload } from "@/lib/api/types";
import {
  createCertificateDraft,
  createCertificateRevision,
  fetchCertificate,
  issueCertificate,
  revokeCertificate,
  saveCertificateDraft,
  uploadCertificatePhoto,
} from "../api";
import { fieldLabel } from "../schemas";

function toastError(error: unknown) {
  toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
}

/** Opens the draft and lands on its editor — one button, one navigation. */
export function useCreateCertificateDraft() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resultId: string) => {
      const { data } = await createCertificateDraft(resultId);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      router.push(`/psikolog/sertifikat/${data.id}`);
    },
    onError: toastError,
  });
}

/**
 * PATCH merges, so a partial save never wipes the rest of the form. The form is
 * re-read afterwards: readiness is the backend's answer, not the browser's
 * guess about which fields it has.
 */
export function useSaveCertificateDraft(
  id: string,
  onSaved: (form: CertificateFormData) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CertificatePayload) => {
      await saveCertificateDraft(id, payload);
      const { data } = await fetchCertificate(id);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (form) => {
      onSaved(form);
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      toast.success("Draf sertifikat tersimpan.");
    },
    onError: toastError,
  });
}

/** The photo is its own request: it is the one field with a file behind it. */
export function useUploadCertificatePhoto(
  id: string,
  onSaved: (form: CertificateFormData) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      await uploadCertificatePhoto(id, file);
      const { data } = await fetchCertificate(id);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (form) => {
      onSaved(form);
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      toast.success("Foto tersimpan.");
    },
    onError: toastError,
  });
}

/**
 * Saves, then publishes. The issue step freezes what is stored, not what is on
 * screen, so publishing without a save would sign the previous draft.
 */
export function useIssueCertificate(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CertificatePayload) => {
      await saveCertificateDraft(id, payload);
      const { data } = await issueCertificate(id);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      toast.success(`Sertifikat ${data.number} diterbitkan.`);
      router.refresh();
    },
    onError: (error) => {
      // 400 incomplete_draft carries the field list; 400 photo_required does not.
      if (isApiError(error) && error.details?.length) {
        toast.error(`Belum lengkap: ${error.details.slice(0, 3).map(fieldLabel).join(", ")}`);
        return;
      }
      toastError(error);
    },
  });
}

/** Opens the correction draft and navigates to it. */
export function useCreateCertificateRevision(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await createCertificateRevision(id);
      return data;
    },
    meta: { silentError: true },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      router.push(`/psikolog/sertifikat/${data.id}`);
    },
    onError: toastError,
  });
}

/** ADMIN only — the psychologist can correct, but not cancel. */
export function useRevokeCertificate(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reason: string) => {
      const { data } = await revokeCertificate(id, reason);
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.certificates.all });
      toast.success("Sertifikat dibatalkan.");
      router.refresh();
    },
    onError: toastError,
  });
}
