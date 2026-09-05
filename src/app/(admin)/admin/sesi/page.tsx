import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateSessionDialog } from "@/features/admin/sessions/components/create-session-dialog";
import { SessionsIsland } from "@/features/admin/sessions/components/sessions-island";
import { fetchSessionsServer } from "@/features/admin/sessions/api.server";
import { qk } from "@/lib/api/query-keys";
import { fetchAdminTestsServer } from "@/features/admin/tests-builder/api.server";
import { fetchInstitutionsServer } from "@/features/admin/institutions/api.server";

export const metadata: Metadata = { title: "Sesi Ujian" };

export default async function SesiPage({ searchParams }: PageProps<"/admin/sesi">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const [sessionPage, publishedTests, institutions] = await Promise.all([
    fetchSessionsServer({ page }),
    fetchAdminTestsServer({ status: "PUBLISHED", limit: 100 }),
    fetchInstitutionsServer({ page: 1, limit: 100 }),
  ]);

  const listKey = qk.admin.sessions.list({ page });
  const tableMeta = sessionPage.meta ?? {
    page,
    limit: 10,
    total: sessionPage.data.length,
    totalPages: 1,
  };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Sesi Ujian"
          description="Sesi group dengan tautan undangan — peserta masuk tanpa akun."
        />
        <CreateSessionDialog
          listKey={listKey}
          tests={publishedTests.data.map((test) => ({ id: test.id, name: test.name }))}
          institutions={institutions.data}
        />
      </div>
      <SessionsIsland listKey={listKey} initial={{ data: sessionPage.data, meta: tableMeta }} page={page} />
    </main>
  );
}
