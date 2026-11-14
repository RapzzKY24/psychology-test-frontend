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

interface LikertItem {
  id: string;
  order: number;
  content: {
    text?: string;
    /** Hidden from the participant; the psychologist may see which scale it feeds. */
    scale?: string;
    reverse?: boolean;
  };
}

interface LikertDetailTableProps {
  items: LikertItem[];
  responses: Array<{ itemId: string; value: unknown }>;
}

/** The rating the runner stores; anything else is treated as blank. */
function ratingLabel(value: unknown): string {
  const rating = (value as { rating?: unknown } | undefined)?.rating;
  return typeof rating === "number" ? String(rating) : "—";
}

/**
 * There is no correct answer in a Likert inventory, so this table shows the
 * statement, the scale it feeds (with its direction) and the rating — never
 * "Benar/Salah".
 */
export function LikertDetailTable({ items, responses }: LikertDetailTableProps) {
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
                <TableHead className="w-24">Skala</TableHead>
                <TableHead className="w-20">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.order}>
                  <TableCell className="tabular-nums">{item.order}</TableCell>
                  <TableCell className="whitespace-pre-wrap text-sm">
                    {item.content.text ?? "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.content.scale ?? "—"}
                    {item.content.reverse && (
                      <span className="ml-1 text-xs text-muted-foreground">(R)</span>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums text-sm">
                    {ratingLabel(responseMap.get(item.id))}
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
