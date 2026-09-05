import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateInvoiceButton } from "@/features/admin/invoices/components/create-invoice-dialog";
import { InvoiceFilters } from "@/features/admin/invoices/components/invoice-filters";
import { InvoicesIsland } from "@/features/admin/invoices/components/invoices-island";
import { InvoicesTable } from "@/features/admin/invoices/components/invoices-table";
import { fetchInvoicesServer } from "@/features/admin/invoices/api.server";
import { qk } from "@/lib/api/query-keys";
import { fetchInstitutionsServer } from "@/features/admin/institutions/api.server";
import { INVOICE_STATUSES } from "@/lib/api/types";
import type { InvoiceStatus } from "@/lib/api/types";

export const metadata: Metadata = { title: "Invoice B2B" };

export default async function InvoicePage({ searchParams }: PageProps<"/admin/invoice">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = INVOICE_STATUSES.includes(sp.status as InvoiceStatus)
    ? (sp.status as InvoiceStatus)
    : undefined;

  // MVP cap (accepted): institutions realistically stay under 100; beyond that
  // names fall back to "—" and the create-invoice select loses options.
  const [invoicePage, institutionPage] = await Promise.all([
    fetchInvoicesServer({ page, status }),
    fetchInstitutionsServer({ page: 1, limit: 100 }),
  ]);

  const institutionMap = Object.fromEntries(
    institutionPage.data.map((institution) => [institution.id, institution.name]),
  );
  const listKey = qk.admin.invoices.list({ page, status });
  const tableMeta = invoicePage.meta ?? {
    page,
    limit: 10,
    total: invoicePage.data.length,
    totalPages: 1,
  };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Invoice B2B"
          description="Tagihan institusi dengan nomor otomatis INV-YYYY-NNNN."
        />
        <CreateInvoiceButton institutions={institutionPage.data} listKey={listKey} />
      </div>
      <InvoiceFilters status={status} />
      <InvoicesIsland
        listKey={listKey}
        initial={{ data: invoicePage.data, meta: tableMeta }}
        page={page}
        status={status}
        institutionMap={institutionMap}
      />
    </main>
  );
}
