import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatIdr } from "@/lib/format/format-idr";
import type { PaginationMeta } from "@/lib/api/types/pagination";
import type { AdminTest, TestStatus } from "@/lib/api/types";
import { TestStatusBadge } from "./status-badge";

interface TestsTableProps {
  rows: AdminTest[];
  meta: PaginationMeta;
  status?: string;
  category?: string;
}

const CATEGORY_LABEL: Record<AdminTest["category"], string> = {
  PERSONALITY: "Kepribadian",
  COGNITIVE: "Kognitif",
  WORK_STYLE: "Gaya Kerja",
  INTEREST: "Minat",
  PROJECTIVE: "Projektif",
};

export function TestsTable({ rows, meta, status, category }: TestsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">Belum ada tes</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {status || category
            ? "Tidak ada tes yang cocok dengan filter ini."
            : "Buat tes pertama lewat tombol Buat Tes di atas."}
        </p>
      </div>
    );
  }

  const pageQuery = (page: number) => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (status) p.set("status", status);
    if (category) p.set("category", category);
    return `/admin/tes?${p.toString()}`;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tes</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Harga</th>
              <th className="px-4 py-3 font-medium">Durasi</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="w-16 px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t transition-colors hover:bg-muted/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/tes/${row.id}`} className="font-medium hover:underline">
                    {row.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{row.slug}</p>
                </td>
                <td className="px-4 py-3">{CATEGORY_LABEL[row.category]}</td>
                <td className="px-4 py-3 tabular-nums">{formatIdr(row.price)}</td>
                <td className="px-4 py-3 tabular-nums">{row.estimatedDurationMin} menit</td>
                <td className="px-4 py-3">
                  <TestStatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tes/${row.id}`}
                    aria-label={`Edit tes ${row.name}`}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Halaman {meta.page} dari {meta.totalPages} · {meta.total} tes
        </p>
        <div className="flex gap-2">
          {meta.page > 1 && (
            <Link
              href={pageQuery(meta.page - 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Sebelumnya
            </Link>
          )}
          {meta.page < meta.totalPages && (
            <Link
              href={pageQuery(meta.page + 1)}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
