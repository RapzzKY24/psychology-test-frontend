import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ArticleFormDialog } from "@/features/admin/articles/components/article-form-dialog";
import { ArticleStatusFilters } from "@/features/admin/articles/components/article-status-filters";
import { ArticlesIsland } from "@/features/admin/articles/components/articles-island";
import { fetchAdminArticlesServer } from "@/features/admin/articles/api.server";
import { qk } from "@/lib/api/query-keys";

export const metadata: Metadata = { title: "Artikel" };

const VALID_STATUSES = ["DRAFT", "PUBLISHED"] as const;

function parseStatus(value: string | string[] | undefined): "DRAFT" | "PUBLISHED" | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first && (VALID_STATUSES as readonly string[]).includes(first)
    ? (first as "DRAFT" | "PUBLISHED")
    : undefined;
}

export default async function ArtikelPage({ searchParams }: PageProps<"/admin/artikel">) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const status = parseStatus(sp.status);

  const articles = await fetchAdminArticlesServer({ page, status });

  const listKey = qk.admin.articles.list({ page, status });
  const tableMeta = articles.meta ?? {
    page,
    limit: 10,
    total: articles.data.length,
    totalPages: 1,
  };

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Artikel"
          description="Tulis dan terbitkan artikel untuk halaman publik."
        />
        <ArticleFormDialog
          mode="create"
          listKey={listKey}
          trigger={
            <Button>
              <Plus className="size-4" aria-hidden />
              Tulis Artikel
            </Button>
          }
        />
      </div>
      <ArticleStatusFilters status={status} />
      <ArticlesIsland
        listKey={listKey}
        initial={{ data: articles.data, meta: tableMeta }}
        page={page}
      />
    </main>
  );
}
