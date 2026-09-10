import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InstansiSessionDialog } from "@/features/instansi/sessions/components/instansi-session-dialog";
import { InstansiSessionsIsland } from "@/features/instansi/sessions/components/instansi-sessions-island";
import { fetchInstansiSessionsServer, fetchPublishedTestsServer } from "@/features/instansi/sessions/api.server";
import { fetchEmployeesServer } from "@/features/instansi/employees/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Data Sesi" };

export default async function SesiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [{ data }, { data: tests }, { data: employees }] = await Promise.all([
    fetchInstansiSessionsServer({ page }),
    fetchPublishedTestsServer(),
    fetchEmployeesServer({ limit: 100 }),
  ]);
  const listKey = qk.instansi.sessions.list({ page });

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Data Sesi"
          description="Sesi tes untuk pegawai — bagikan tautan undangan ke peserta."
        />
        <InstansiSessionDialog
          listKey={listKey}
          tests={tests.map((t) => ({ id: t.id, name: t.name }))}
          employees={employees.map((e) => ({ id: e.id, name: e.name }))}
        />
      </div>
      <InstansiSessionsIsland
        listKey={listKey}
        initial={{ data }}
        page={page}
      />
    </main>
  );
}
