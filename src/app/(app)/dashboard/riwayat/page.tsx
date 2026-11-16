import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { fetchMeAttemptsServer } from "@/features/participant/api";
import { PARTICIPANT_STAGES, type ParticipantStage } from "@/features/participant/stages";
import { RiwayatFilters } from "@/features/participant/components/riwayat-filters";
import { RiwayatTable } from "@/features/participant/components/riwayat-table";

export const metadata: Metadata = { title: "Riwayat" };

export default async function RiwayatPage({ searchParams }: PageProps<"/dashboard/riwayat">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const stageRaw = Array.isArray(sp.stage) ? sp.stage[0] : sp.stage;
  const stage = PARTICIPANT_STAGES.includes(stageRaw as ParticipantStage)
    ? (stageRaw as ParticipantStage)
    : undefined;

  const { data, meta } = await fetchMeAttemptsServer({ page, stage });
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Riwayat"
        description="Semua tes yang pernah Anda kerjakan, lengkap dengan statusnya."
      />
      <RiwayatFilters stage={stage} />
      <RiwayatTable rows={data} meta={tableMeta} stage={stage} />
    </main>
  );
}
