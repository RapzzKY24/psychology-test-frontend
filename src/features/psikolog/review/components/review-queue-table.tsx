import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { ReviewListItem } from "@/lib/api/types";
import { ReviewQueueCards } from "./review-queue-cards";
import { ReviewQueueDesktopTable } from "./review-queue-desktop-table";

interface ReviewQueueTableProps {
  rows: ReviewListItem[];
  meta: PaginationMeta;
  status?: string;
}

export function ReviewQueueTable({ rows, meta, status }: ReviewQueueTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Antrean kosong"
        description="Hasil yang butuh peninjauan akan muncul di sini."
        filtered={Boolean(status)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (status) p.set("status", status);
    return `/psikolog/review?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <ReviewQueueDesktopTable rows={rows} />
      <ReviewQueueCards rows={rows} />
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
