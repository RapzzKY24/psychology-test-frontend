"use client";

import { Button } from "@/components/ui/button";
import { useCreateCertificateDraft } from "../hooks/use-certificate-mutations";

/**
 * Opens the draft and navigates to it. The backend is idempotent, so a double
 * click returns the row that already exists instead of making a second one.
 */
export function CreateCertificateButton({ resultId }: { resultId: string }) {
  const create = useCreateCertificateDraft();

  return (
    <Button size="sm" disabled={create.isPending} onClick={() => create.mutate(resultId)}>
      {create.isPending ? "Membuka..." : "Buat Sertifikat"}
    </Button>
  );
}
