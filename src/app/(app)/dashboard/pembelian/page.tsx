import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { fetchMeOrdersServer } from "@/features/participant/api";
import { PembelianFilters } from "@/features/participant/components/pembelian-filters";
import { PembelianTable } from "@/features/participant/components/pembelian-table";
import type { OrderStatus } from "@/lib/api/types";

export const metadata: Metadata = { title: "Pembelian" };

const STATUSES: readonly OrderStatus[] = ["PENDING", "PAID", "EXPIRED", "CANCELLED"];

export default async function PembelianPage({ searchParams }: PageProps<"/dashboard/pembelian">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const statusRaw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status = STATUSES.includes(statusRaw as OrderStatus)
    ? (statusRaw as OrderStatus)
    : undefined;

  const { data, meta } = await fetchMeOrdersServer({ page, status });
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Pembelian"
        description="Riwayat pembelian tes dan status pembayarannya."
      />
      <PembelianFilters status={status} />
      <PembelianTable rows={data} meta={tableMeta} status={status} />
    </main>
  );
}
