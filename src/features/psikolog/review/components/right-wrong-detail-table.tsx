"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RightWrongItemContent } from "@/lib/api/types";
import { isShortItem, keyLabel, responseLabel } from "../lib/answer-labels";

interface RightWrongItem {
  id: string;
  order: number;
  content: RightWrongItemContent;
}

interface RightWrongScores {
  raw: number;
  total: number;
  perItem: boolean[];
  iq?: number;
}

interface RightWrongDetailTableProps {
  items: RightWrongItem[];
  responses: Array<{ itemId: string; value: unknown }>;
  scores?: RightWrongScores;
}

export function RightWrongDetailTable({ items, responses, scores }: RightWrongDetailTableProps) {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.value]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Jawaban per soal</CardTitle>
        {scores && (
          <p className="text-sm text-muted-foreground">
            {scores.raw} dari {scores.total} benar ({Math.round((scores.raw / scores.total) * 100)}%)
            {typeof scores.iq === "number" && <> · IQ {scores.iq}</>}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Soal</TableHead>
                <TableHead>Jawaban</TableHead>
                <TableHead>Kunci</TableHead>
                <TableHead className="w-20">Hasil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const short = isShortItem(item.content);
                // The scorer already decided, and it owns the matching rules
                // (set order, comma decimals) — never re-derive correctness here.
                const isCorrect = scores?.perItem?.[index] ?? false;

                return (
                  <TableRow key={item.order}>
                    <TableCell className="tabular-nums">{item.order}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.content.question && (
                          <p className="whitespace-pre-wrap text-sm">{item.content.question}</p>
                        )}
                        {item.content.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.content.imageUrl}
                            alt={`Gambar soal ${item.order}`}
                            className="max-h-32 rounded border object-contain"
                          />
                        )}
                        {!short && (item.content.options?.length ?? 0) > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {item.content.options
                              ?.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {responseLabel(item.content, responseMap.get(item.id))}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{keyLabel(item.content)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          isCorrect ? "text-green-600 font-medium" : "text-destructive font-medium"
                        }
                      >
                        {isCorrect ? "Benar" : "Salah"}
                      </span>
                    </TableCell>
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
