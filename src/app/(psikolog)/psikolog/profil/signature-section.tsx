"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignaturePadField } from "@/features/psikolog/profil/components/signature-pad-field";
import { SignatureUploadField } from "@/features/psikolog/profil/components/signature-upload-field";

export function SignatureSection({ imagePath }: { imagePath: string | null }) {
  const router = useRouter();
  const hasSignature = imagePath !== null && imagePath.length > 0;
  const refresh = () => router.refresh();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tanda tangan digital</CardTitle>
        <CardDescription>
          Dipakai di dokumen hasil. Gambar di kanvas atau unggah foto TTD.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <p className="rounded-lg border bg-muted/50 p-3 text-sm">
          {hasSignature
            ? "Tanda tangan aktif tersimpan."
            : "Belum ada tanda tangan tersimpan."}
        </p>
        <SignaturePadField onSaved={refresh} />
        <SignatureUploadField onSaved={refresh} />
      </CardContent>
    </Card>
  );
}
