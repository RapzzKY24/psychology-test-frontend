import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMyProfile } from "@/features/psikolog/monitor/api.server";
import { ProfileForm } from "./profile-form";
import { SignatureSection } from "./signature-section";

export const metadata: Metadata = { title: "Profil & TTD" };

export default async function ProfilPage() {
  const profile = await fetchMyProfile();

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Profil & Tanda Tangan"
        description="Data kredensial dan tanda tangan digital untuk dokumen hasil."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data profil</CardTitle>
          <CardDescription>NIK dan asal instansi diisi admin, tidak bisa diubah.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile.data} />
        </CardContent>
      </Card>
      <SignatureSection imagePath={profile.data?.signatureImagePath ?? null} />
    </main>
  );
}
