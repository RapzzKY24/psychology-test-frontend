import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResultsIsland } from "@/features/instansi/results/components/results-island";
import { fetchInstansiResultsServer } from "@/features/instansi/results/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Hasil" };

export default async function HasilPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { data } = await fetchInstansiResultsServer({ page });
  const listKey = qk.instansi.results.list({ page });

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader title="Hasil Tes" description="Hasil peserta yang sudah disetujui psikolog." />
      <ResultsIsland listKey={listKey} initial={{ data }} page={page} />
    </main>
  );
}
