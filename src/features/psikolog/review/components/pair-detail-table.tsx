import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface PairItem {
  id: string;
  order: number;
  content: {
    question?: string;
    statements?: string[];
    mapping?: string[];
  };
}

export interface PairResponseRow {
  itemId: string;
  value: unknown;
}

interface PairDetailTableProps {
  items: PairItem[];
  responses: PairResponseRow[];
}

const SIDE_LABEL = ["A", "B"];

/** The statement index the participant picked, or null when the item is blank. */
function chosenIndex(value: unknown): number | null {
  const chosen = (value as { chosen?: unknown } | undefined)?.chosen;
  return typeof chosen === "number" ? chosen : null;
}

/**
 * Psychologist view of a pair test: what the participant saw, which statement
 * they picked, and the pole it scored. The mapping column is the key, so it is
 * only rendered here — never in the participant-facing payload.
 */
export function PairDetailTable({ items, responses }: PairDetailTableProps) {
  const valueByItem = new Map(responses.map((row) => [row.itemId, row.value]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Jawaban per soal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Pernyataan dipilih</TableHead>
                <TableHead className="w-24">Kutub</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const chosen = chosenIndex(valueByItem.get(item.id));
                const statement = chosen === null ? null : item.content.statements?.[chosen];
                const pole = chosen === null ? null : item.content.mapping?.[chosen];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="tabular-nums">{item.order}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.content.question ?? "—"}
                    </TableCell>
                    <TableCell>
                      {statement ? `${SIDE_LABEL[chosen as number]}. ${statement}` : "—"}
                    </TableCell>
                    <TableCell className="font-mono font-medium">{pole ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
