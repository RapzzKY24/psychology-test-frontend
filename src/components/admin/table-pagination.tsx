import Link from "next/link";
import type { PaginationMeta } from "@/lib/api/types/pagination";

interface TablePaginationProps {
  meta: PaginationMeta;
  /** Builds the href for a page number, preserving current filters. */
  pageHref: (page: number) => string;
}

export function TablePagination({ meta, pageHref }: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        Halaman {meta.page} dari {meta.totalPages} · {meta.total} data
      </p>
      <div className="flex gap-2">
        {meta.page > 1 && (
          <Link
            href={pageHref(meta.page - 1)}
            className="rounded-md border px-3 py-1.5 hover:bg-muted"
          >
            Sebelumnya
          </Link>
        )}
        {meta.page < meta.totalPages && (
          <Link
            href={pageQueryNextSafe(meta.page, meta.totalPages, pageHref)}
            className="rounded-md border px-3 py-1.5 hover:bg-muted"
          >
            Berikutnya
          </Link>
        )}
      </div>
    </div>
  );
}

function pageQueryNextSafe(
  page: number,
  totalPages: number,
  pageHref: (page: number) => string,
): string {
  return pageHref(Math.min(page + 1, totalPages));
}
