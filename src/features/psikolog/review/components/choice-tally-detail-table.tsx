"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChoiceTallyItem {
  id: string;
  order: number;
  content: {
    question?: string;
    options?: string[];
    /** One scale per option; hidden from the participant, shown to the psychologist. */
    mapping?: string[];
  };
}

interface ChoiceTallyDetailTableProps {
  items: ChoiceTallyItem[];
  responses: Array<{ itemId: string; value: unknown }>;
}

/** Answer index the runner stores; anything else is treated as blank. */
function chosenIndex(value: unknown): number | null {
  const chosen = (value as { chosen?: unknown } | undefined)?.chosen;
  return typeof chosen === "number" ? chosen : null;
}

/**
 * Same idea as the scale tally table, but the scale lives on the chosen option
 * instead of the item: the row shows the answer and the scale that answer fed.
 */
export function ChoiceTallyDetailTable({ items, responses }: ChoiceTallyDetailTableProps) {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.value]));

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
                <TableHead className="w-12">No</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Jawaban</TableHead>
                <TableHead className="w-20">Skala</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const index = chosenIndex(responseMap.get(item.id));
                const answer = index === null ? "—" : (item.content.options?.[index] ?? "—");
                const scale = index === null ? "—" : (item.content.mapping?.[index] ?? "—");
                return (
                  <TableRow key={item.order}>
                    <TableCell className="tabular-nums">{item.order}</TableCell>
                    <TableCell className="whitespace-pre-wrap text-sm">
                      {item.content.question ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{answer}</TableCell>
                    <TableCell className="font-mono text-sm">{scale}</TableCell>
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
