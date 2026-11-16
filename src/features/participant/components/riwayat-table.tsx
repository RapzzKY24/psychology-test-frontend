import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { TablePagination } from "@/components/admin/table-pagination";
import type { MeAttemptItem } from "@/lib/api/types";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import { formatIdDate } from "@/lib/format/format-date";
import { stageOf, type ParticipantStage } from "../stages";
import { ParticipantStageBadge } from "./participant-stage-badge";
import { ReviewNoteDialog } from "./review-note-dialog";

const ACTION_LINK = "text-sm font-medium text-primary hover:underline";

function RowAction({ row }: { row: MeAttemptItem }) {
  const stage = stageOf(row);

  if (stage === "IN_PROGRESS") {
    return (
      <Link href={`/tes/kerjakan/${row.id}`} className={ACTION_LINK}>
        Lanjutkan
      </Link>
    );
  }
  if (stage === "APPROVED") {
    return (
      <Link href={`/hasil/${row.id}`} className={ACTION_LINK}>
        Lihat hasil
      </Link>
    );
  }
  if (stage === "RETURNED" && row.reviewNote) {
    return <ReviewNoteDialog testName={row.testName} note={row.reviewNote} />;
  }
  return <span className="text-sm text-muted-foreground">—</span>;
}

interface RiwayatTableProps {
  rows: MeAttemptItem[];
  meta: PaginationMeta;
  stage?: ParticipantStage;
}

export function RiwayatTable({ rows, meta, stage }: RiwayatTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada tes"
        description="Tes yang Anda kerjakan muncul di sini setelah dimulai."
        filtered={Boolean(stage)}
      />
    );
  }

  const pageHref = (next: number) => {
    const p = new URLSearchParams();
    p.set("page", String(next));
    if (stage) p.set("stage", stage);
    return `/dashboard/riwayat?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      {/* A table cannot fit four columns on a phone, so small screens get a
          list with the same information instead of a sideways scroll. */}
      <ul className="divide-y rounded-lg border sm:hidden">
        {rows.map((row) => {
          const rowStage = stageOf(row);
          return (
            <li key={row.id} className="flex items-start justify-between gap-3 p-3">
              <div className="min-w-0 space-y-1.5">
                <p className="text-sm font-medium leading-snug">{row.testName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {rowStage ? (
                    <ParticipantStageBadge stage={rowStage} />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatIdDate(row.startedAt)}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <RowAction row={row} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden rounded-lg border sm:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tes</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const rowStage = stageOf(row);
              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.testName}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatIdDate(row.startedAt)}
                  </TableCell>
                  <TableCell>
                    {rowStage ? (
                      <ParticipantStageBadge stage={rowStage} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <RowAction row={row} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination meta={meta} pageHref={pageHref} />
    </div>
  );
}
