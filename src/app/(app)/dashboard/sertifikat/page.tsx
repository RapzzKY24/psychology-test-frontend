import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import { fetchMeCertificatesServer } from "@/features/participant/api";
import { SertifikatCard } from "@/features/participant/components/sertifikat-card";

export const metadata: Metadata = { title: "Sertifikat" };

export default async function SertifikatPage({ searchParams }: PageProps<"/dashboard/sertifikat">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const { data, meta } = await fetchMeCertificatesServer(page);
  const tableMeta = meta ?? { page, limit: 10, total: data.length, totalPages: 1 };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6">
      <PageHeader
        title="Sertifikat"
        description="Sertifikat yang diterbitkan psikolog setelah hasil disetujui."
      />

      {data.length === 0 ? (
        <TableEmpty
          title="Belum ada sertifikat"
          description="Sertifikat terbit setelah psikolog menyetujui hasil dan menerbitkannya."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((certificate) => (
              <SertifikatCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
          <TablePagination
            meta={tableMeta}
            pageHref={(next) => `/dashboard/sertifikat?page=${next}`}
          />
        </>
      )}
    </main>
  );
}
