import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResultFilters } from "@/features/admin/results-monitor/components/result-filters";
import { ResultsTable } from "@/features/admin/results-monitor/components/results-table";
import { fetchResultsServer } from "@/features/admin/results-monitor/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Monitor Hasil" };

const VALID_STATUSES = ["PENDING_REVIEW", "APPROVED", "RETURNED"] as const;
type Status = (typeof VALID_STATUSES)[number];

export default async function HasilPage({ searchParams }: PageProps<"/admin/hasil">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = VALID_STATUSES.includes(sp.status as Status) ? (sp.status as Status) : undefined;

  const listKey = qk.admin.results.list({ page, status });
  const { data, meta } = await fetchResultsServer({ page, status });
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Monitor Hasil"
        description="Status hasil peserta — approval dilakukan psikolog, kirim ulang untuk hasil yang dikembalikan."
      />
      <ResultFilters status={status} />
      <ResultsTable rows={data} meta={tableMeta} listKey={listKey} status={status} />
    </main>
  );
}
