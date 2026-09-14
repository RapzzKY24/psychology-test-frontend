"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RightWrongItem {
  id: string;
  order: number;
  content: {
    question?: string | null;
    imageUrl?: string | null;
    options: string[];
    correctIndex: number;
  };
}

interface RightWrongDetailTableProps {
  items: RightWrongItem[];
  responses: Array<{ itemId: string; value: { chosen: number } }>;
  scores?: { raw: number; total: number; perItem: boolean[] };
}

export function RightWrongDetailTable({ items, responses, scores }: RightWrongDetailTableProps) {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.value.chosen]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Jawaban per soal</CardTitle>
        {scores && (
          <p className="text-sm text-muted-foreground">
            {scores.raw} dari {scores.total} benar ({Math.round((scores.raw / scores.total) * 100)}%)
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
              {items.map((item) => {
                const chosen = responseMap.get(item.id);
                const correct = item.content.correctIndex;
                const isCorrect = chosen === correct;
                const chosenLabel =
                  typeof chosen === "number" && item.content.options[chosen]
                    ? `${String.fromCharCode(65 + chosen)}. ${item.content.options[chosen]}`
                    : "—";
                const correctLabel = `${String.fromCharCode(65 + correct)}. ${item.content.options[correct] ?? "—"}`;
                return (
                  <TableRow key={item.order}>
                    <TableCell className="tabular-nums">{item.order}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.content.question && <p className="text-sm">{item.content.question}</p>}
                        {item.content.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.content.imageUrl}
                            alt={`Gambar soal ${item.order}`}
                            className="max-h-32 rounded border object-contain"
                          />
                        )}
                        <p className="text-xs text-muted-foreground">
                          {item.content.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(" · ")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{chosenLabel}</TableCell>
                    <TableCell className="text-sm font-medium">{correctLabel}</TableCell>
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
