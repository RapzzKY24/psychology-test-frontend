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

type AnswerMode = "choice" | "short";

interface RightWrongItem {
  id: string;
  order: number;
  content: {
    answerMode?: AnswerMode;
    question?: string | null;
    imageUrl?: string | null;
    options?: string[];
    correctIndexes?: number[];
    /** Legacy single key, still present on rows written before 2026-11. */
    correctIndex?: number;
    accepted?: string[];
  };
}

interface RightWrongResponse {
  /** Array for the current shape, bare number for legacy rows. */
  chosen?: number | number[];
  text?: string;
}

interface RightWrongDetailTableProps {
  items: RightWrongItem[];
  responses: Array<{ itemId: string; value: RightWrongResponse }>;
  scores?: { raw: number; total: number; perItem: boolean[] };
}

function chosenIndexes(value: RightWrongResponse | undefined): number[] {
  if (!value) return [];
  if (typeof value.chosen === "number") return [value.chosen];
  return value.chosen ?? [];
}

function keysOf(item: RightWrongItem): number[] {
  if (item.content.correctIndexes) return item.content.correctIndexes;
  if (typeof item.content.correctIndex === "number") return [item.content.correctIndex];
  return [];
}

function isShort(item: RightWrongItem): boolean {
  return item.content.answerMode === "short";
}

export function RightWrongDetailTable({ items, responses, scores }: RightWrongDetailTableProps) {
  const responseMap = new Map(responses.map((r) => [r.itemId, r.value]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Jawaban per soal</CardTitle>
        {scores && (
          <p className="text-sm text-muted-foreground">
            {scores.raw} dari {scores.total} benar ({Math.round((scores.raw / scores.total) * 100)}
            %)
            {typeof (scores as { iq?: number }).iq === "number" && (
              <> · IQ {(scores as { iq?: number }).iq}</>
            )}
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
                const response = responseMap.get(item.id);
                const short = isShort(item);
                const options = item.content.options ?? [];
                const keys = keysOf(item);

                const chosenLabel = short
                  ? response?.text?.trim() || "—"
                  : chosenIndexes(response)
                      .map((idx) =>
                        options[idx]
                          ? `${String.fromCharCode(65 + idx)}. ${options[idx]}`
                          : String.fromCharCode(65 + idx),
                      )
                      .join(", ") || "—";

                const correctLabel = short
                  ? item.content.accepted?.join(" / ") || "—"
                  : keys
                      .map((idx) =>
                        options[idx]
                          ? `${String.fromCharCode(65 + idx)}. ${options[idx]}`
                          : String.fromCharCode(65 + idx),
                      )
                      .join(", ") || "—";

                // The scorer already decided, and it knows the matching rules
                // (set order, comma decimals) — never re-derive it here.
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
                        {!short && options.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {options
                              .map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`)
                              .join(" · ")}
                          </p>
                        )}
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
