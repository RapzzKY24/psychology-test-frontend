import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { fetchMeProfileServer } from "@/features/participant/api";
import { ProfileDeclarations } from "@/features/participant/components/profile-declarations";
import { ProfileForm } from "@/features/participant/components/profile-form";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilPage() {
  const { data: profile } = await fetchMeProfileServer();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Profil"
        description="Data akun yang dipakai untuk laporan dan sertifikat."
      />

      <section className="space-y-4 rounded-lg border p-5">
        <div>
          <h2 className="text-base font-semibold">Data akun</h2>
          <p className="text-sm text-muted-foreground">
            Nama dan nomor WhatsApp bisa Anda ubah kapan saja.
          </p>
        </div>
        <ProfileForm profile={profile} />
      </section>

      <section className="space-y-4 rounded-lg border p-5">
        <div>
          <h2 className="text-base font-semibold">Data saat tes</h2>
          <p className="text-sm text-muted-foreground">
            Dipakai untuk memilih norma penilaian, jadi dibaca dari tes terakhir.
          </p>
        </div>
        <ProfileDeclarations attempt={profile.lastAttempt} />
      </section>
    </main>
  );
}
