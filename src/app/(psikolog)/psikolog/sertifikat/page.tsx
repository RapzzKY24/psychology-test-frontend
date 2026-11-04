import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CertificatesTable } from "@/features/psikolog/certificates/components/certificates-table";
import { PendingCertificatesTable } from "@/features/psikolog/certificates/components/pending-certificates-table";
import {
  fetchCertificatesServer,
  fetchPendingCertificatesServer,
} from "@/features/psikolog/certificates/api.server";

export const metadata: Metadata = { title: "Sertifikat" };

const LIMIT = 10;

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pendingPage?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const pendingPage = Math.max(Number(sp.pendingPage ?? "1") || 1, 1);

  const emptyMeta = (p: number) => ({ page: p, limit: LIMIT, total: 0, totalPages: 0 });

  const [pending, certificates] = await Promise.all([
    fetchPendingCertificatesServer({ page: pendingPage, limit: LIMIT }).catch(() => ({
      data: [],
      meta: emptyMeta(pendingPage),
    })),
    fetchCertificatesServer({ page, limit: LIMIT }).catch(() => ({
      data: [],
      meta: emptyMeta(page),
    })),
  ]);

  return (
    <main className="flex-1 space-y-8 p-6">
      <PageHeader
        title="Sertifikat"
        description="Terbitkan sertifikat hasil tes psikologi, lalu unduh atau koreksi lewat revisi."
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Menunggu sertifikat</h2>
          <p className="text-sm text-muted-foreground">
            Hasil yang sudah disetujui psikolog dan belum punya sertifikat. WPT tidak termasuk.
          </p>
        </div>
        <PendingCertificatesTable
          rows={pending.data}
          meta={pending.meta ?? emptyMeta(pendingPage)}
          pageHref={(p) => `/psikolog/sertifikat?pendingPage=${p}&page=${page}`}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Daftar sertifikat</h2>
          <p className="text-sm text-muted-foreground">
            Draf yang sedang diisi dan sertifikat yang sudah terbit.
          </p>
        </div>
        <CertificatesTable
          rows={certificates.data}
          meta={certificates.meta ?? emptyMeta(page)}
          pageHref={(p) => `/psikolog/sertifikat?page=${p}&pendingPage=${pendingPage}`}
        />
      </section>
    </main>
  );
}
