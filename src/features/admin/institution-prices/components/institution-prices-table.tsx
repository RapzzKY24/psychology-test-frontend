import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import { formatIdr } from "@/lib/format/format-idr";
import type { InstitutionTestPriceRow } from "@/lib/api/types";

interface InstitutionPricesTableProps {
  rows: InstitutionTestPriceRow[];
  draft: Record<string, string>;
  invalidTestIds: Set<string>;
  onDraftChange: (testId: string, value: string) => void;
}

/** Presentational price editor — props in, JSX out (no fetch, no mutation). */
export function InstitutionPricesTable({
  rows,
  draft,
  invalidTestIds,
  onDraftChange,
}: InstitutionPricesTableProps) {
  if (rows.length === 0) {
    return (
      <TableEmpty
        title="Belum ada tes published"
        description="Harga khusus hanya bisa dipasang pada tes yang sudah dipublish."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Tes</TableHead>
            <TableHead>Harga Website</TableHead>
            <TableHead>Harga Khusus (per peserta)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const value = draft[row.testId] ?? "";
            const isInvalid = invalidTestIds.has(row.testId);
            return (
              <TableRow key={row.testId}>
                <TableCell>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-muted-foreground text-xs">{row.slug}</p>
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatIdr(row.basePrice)}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder={String(row.basePrice)}
                    aria-label={`Harga khusus ${row.name}`}
                    aria-invalid={isInvalid}
                    value={value}
                    onChange={(event) =>
                      onDraftChange(row.testId, event.target.value)
                    }
                    className="max-w-40 tabular-nums"
                  />
                </TableCell>
                <TableCell>
                  {isInvalid ? (
                    <span className="text-destructive text-sm">Tidak valid</span>
                  ) : value.trim() !== "" ? (
                    <Badge variant="secondary">Harga Khusus</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Harga website
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
