import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InstansiSessionsIsland } from "@/features/instansi/sessions/components/instansi-sessions-island";
import { fetchInstansiSessionsServer } from "@/features/instansi/sessions/api.server";

export const metadata: Metadata = { title: "Data Sesi" };

export default async function SesiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { data } = await fetchInstansiSessionsServer({ page });

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Data Sesi"
        description="Sesi tes untuk pegawai — bagikan tautan undangan ke peserta."
      />
      <InstansiSessionsIsland initial={{ data }} page={page} />
    </main>
  );
}
