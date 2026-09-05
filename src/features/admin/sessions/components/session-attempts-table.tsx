import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableEmpty } from "@/components/admin/table-empty";
import type { SessionDetail } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

export function SessionAttemptsTable({
  attempts,
  tests,
}: {
  attempts: SessionDetail["attempts"];
  tests: SessionDetail["tests"];
}) {
  if (attempts.length === 0) {
    return (
      <TableEmpty title="Belum ada attempt" description="Attempt muncul setelah peserta join dan mulai mengerjakan." />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Test</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Selesai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell>
                {tests.find((t) => t.testId === attempt.testId)?.testName ?? attempt.testId}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{attempt.status}</Badge>
              </TableCell>
              <TableCell className="tabular-nums">{formatIdDate(attempt.startedAt)}</TableCell>
              <TableCell className="tabular-nums">{formatIdDate(attempt.completedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
