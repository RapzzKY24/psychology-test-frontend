import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InstansiReportsTable } from "@/features/instansi/reports/components/instansi-reports-table";
import { fetchInstansiReportsServer } from "@/features/instansi/reports/api.server";

export const metadata: Metadata = { title: "Laporan" };

const LIMIT = 10;

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sessionId?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);

  const emptyMeta = { page, limit: LIMIT, total: 0, totalPages: 0 };
  const reports = await fetchInstansiReportsServer({
    page,
    limit: LIMIT,
    sessionId: sp.sessionId,
  }).catch(() => ({ data: [], meta: emptyMeta }));

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Laporan"
        description="Laporan psikologi peserta yang sudah diterbitkan. Unduh lalu kirim ke peserta."
      />
      <InstansiReportsTable
        rows={reports.data}
        meta={reports.meta ?? emptyMeta}
        pageHref={(p) => `/instansi/laporan?page=${p}`}
      />
    </main>
  );
}
