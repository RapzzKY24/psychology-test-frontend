import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmployeeFormDialog } from "@/features/instansi/employees/components/employee-form-dialog";
import { EmployeesIsland } from "@/features/instansi/employees/components/employees-island";
import { fetchEmployeesServer } from "@/features/instansi/employees/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Data Pegawai" };

export default async function PegawaiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { data } = await fetchEmployeesServer({ page });
  const listKey = qk.instansi.employees.list({ page });

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Data Pegawai"
          description="Master data pegawai untuk roster sesi tes."
        />
        <EmployeeFormDialog listKey={listKey} mode="create" />
      </div>
      <EmployeesIsland
        listKey={listKey}
        initial={{ data }}
        page={page}
      />
    </main>
  );
}
