import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PendingReportsTable } from "@/features/psikolog/reports/components/pending-reports-table";
import { ReportsTable } from "@/features/psikolog/reports/components/reports-table";
import {
  fetchPendingReportsServer,
  fetchReportsServer,
} from "@/features/psikolog/reports/api.server";

export const metadata: Metadata = { title: "Laporan" };

const LIMIT = 10;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pendingPage?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const pendingPage = Math.max(Number(sp.pendingPage ?? "1") || 1, 1);

  const emptyMeta = (p: number) => ({ page: p, limit: LIMIT, total: 0, totalPages: 0 });

  const [pending, reports] = await Promise.all([
    fetchPendingReportsServer({ page: pendingPage, limit: LIMIT }).catch(() => ({
      data: [],
      meta: emptyMeta(pendingPage),
    })),
    fetchReportsServer({ page, limit: LIMIT }).catch(() => ({
      data: [],
      meta: emptyMeta(page),
    })),
  ]);

  return (
    <main className="flex-1 space-y-8 p-6">
      <PageHeader
        title="Laporan"
        description="Isi laporan psikologi peserta, lalu terbitkan agar bisa diunduh instansi."
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Menunggu laporan</h2>
          <p className="text-sm text-muted-foreground">
            Semua tes sudah disetujui, laporan belum dibuat.
          </p>
        </div>
        <PendingReportsTable
          rows={pending.data}
          meta={pending.meta ?? emptyMeta(pendingPage)}
          pageHref={(p) => `/psikolog/laporan?pendingPage=${p}&page=${page}`}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Daftar laporan</h2>
          <p className="text-sm text-muted-foreground">
            Draf yang sedang diisi dan laporan yang sudah terbit.
          </p>
        </div>
        <ReportsTable
          rows={reports.data}
          meta={reports.meta ?? emptyMeta(page)}
          pageHref={(p) => `/psikolog/laporan?page=${p}&pendingPage=${pendingPage}`}
        />
      </section>
    </main>
  );
}
