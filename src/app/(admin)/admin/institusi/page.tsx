import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InstitutionFormDialog } from "@/features/admin/institutions/components/institution-form-dialog";
import { InstitutionsTable } from "@/features/admin/institutions/components/institutions-table";
import { fetchInstitutionsServer } from "@/features/admin/institutions/api.server";

export const metadata: Metadata = { title: "Data Institusi" };

export default async function InstitusiPage({ searchParams }: PageProps<"/admin/institusi">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { data, meta } = await fetchInstitutionsServer({ page });
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Data Institusi"
          description="Institusi klien B2B — pemilik sesi group dan invoice."
        />
        <InstitutionFormDialog mode="create" />
      </div>
      <InstitutionsTable rows={data} meta={tableMeta} page={page} />
    </main>
  );
}
