import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableEmpty } from "@/components/admin/table-empty";
import type { SessionDetail } from "@/lib/api/types";
import { formatIdDate } from "@/lib/format/format-date";

export function SessionParticipantsTable({
  participants,
}: {
  participants: SessionDetail["participants"];
}) {
  if (participants.length === 0) {
    return (
      <TableEmpty title="Belum ada peserta yang join" />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No. Peserta</TableHead>
            <TableHead>Join</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">{participant.name}</TableCell>
              <TableCell>{participant.email ?? "—"}</TableCell>
              <TableCell className="tabular-nums">{participant.candidateNumber ?? "—"}</TableCell>
              <TableCell className="tabular-nums">{formatIdDate(participant.joinedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
