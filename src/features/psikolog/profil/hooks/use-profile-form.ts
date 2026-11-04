"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FORM_INVALID_TOAST } from "@/lib/copy";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { PsychologistProfile } from "@/lib/api/types";
import { updateMyProfile } from "../api";
import { ProfileSchema, toProfilePayload } from "../schemas";
import type { ProfileInput } from "../schemas";
import { joinDisplayName } from "../utils/split-display-name";

export function useProfileForm(
  profile: PsychologistProfile | null,
  onSaved: () => void,
) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: profile ? joinDisplayName(profile) : "",
      licenseNumber: profile?.licenseNumber ?? "",
      sippNumber: profile?.sippNumber ?? "",
      nik: profile?.nik ?? "",
      institutionName: profile?.institutionName ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileInput) => {
      const { data } = await updateMyProfile(toProfilePayload(values));
      return data;
    },
    meta: { silentError: true },
    onSuccess: () => {
      toast.success("Profil tersimpan.");
      onSaved();
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: qk.psikolog.profile });
    },
  });

  const submit = form.handleSubmit(
    (values) => mutation.mutate(values),
    () => toast.error(FORM_INVALID_TOAST),
  );

  return { form, mutation, submit };
}
