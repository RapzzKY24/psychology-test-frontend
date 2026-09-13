"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignaturePadField } from "@/features/psikolog/profil/components/signature-pad-field";
import { SignaturePreviewImage } from "@/features/psikolog/profil/components/signature-preview-image";
import { SignatureUploadField } from "@/features/psikolog/profil/components/signature-upload-field";

export function SignatureSection({ imagePath }: { imagePath: string | null }) {
  const router = useRouter();
  const [savedCount, setSavedCount] = useState(0);
  const hasSignature = imagePath !== null && imagePath.length > 0;
  const refresh = () => {
    setSavedCount((count) => count + 1);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tanda tangan digital</CardTitle>
        <CardDescription>
          Dipakai di dokumen hasil. Gambar di kanvas atau unggah foto TTD.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {hasSignature ? (
          <figure className="grid gap-2">
            <SignaturePreviewImage key={savedCount} cacheKey={savedCount} />
            <figcaption className="text-sm text-muted-foreground">
              Tanda tangan aktif tersimpan.
            </figcaption>
          </figure>
        ) : (
          <p className="rounded-lg border bg-muted/50 p-3 text-sm">
            Belum ada tanda tangan tersimpan.
          </p>
        )}
        <Tabs defaultValue="draw">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Gambar</TabsTrigger>
            <TabsTrigger value="upload">Unggah</TabsTrigger>
          </TabsList>
          <TabsContent value="draw">
            <SignaturePadField onSaved={refresh} />
          </TabsContent>
          <TabsContent value="upload">
            <SignatureUploadField onSaved={refresh} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
