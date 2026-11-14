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

interface ScaleTallyItem {
  id: string;
  order: number;
  content: {
    question?: string;
    options?: string[];
    /** Hidden from the participant; the psychologist may see which scale it feeds. */
    scale?: string;
  };
}

interface ScaleTallyDetailTableProps {
  items: ScaleTallyItem[];
  responses: Array<{ itemId: string; value: unknown }>;
}

/** Answer index the runner stores; anything else is treated as blank. */
function chosenLabel(item: ScaleTallyItem, value: unknown): string {
  const chosen = (value as { chosen?: unknown } | undefined)?.chosen;
  if (typeof chosen !== "number") return "—";
  return item.content.options?.[chosen] ?? "—";
}

/**
 * There is no correct answer in a tally instrument, so this table shows the
 * statement, the scale it feeds and the answer — never "Benar/Salah".
 */
export function ScaleTallyDetailTable({ items, responses }: ScaleTallyDetailTableProps) {
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
                <TableHead>Pernyataan</TableHead>
                <TableHead className="w-20">Skala</TableHead>
                <TableHead className="w-24">Jawaban</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.order}>
                  <TableCell className="tabular-nums">{item.order}</TableCell>
                  <TableCell className="whitespace-pre-wrap text-sm">
                    {item.content.question ?? "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.content.scale ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {chosenLabel(item, responseMap.get(item.id))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
