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

interface OptionScaleItem {
  id: string;
  order: number;
  content: {
    text?: string;
    options?: string[];
    /** Hidden from the participant; the psychologist may see which factor it feeds. */
    scale?: string;
    reverse?: boolean;
  };
}

interface OptionScaleDetailTableProps {
  items: OptionScaleItem[];
  responses: Array<{ itemId: string; value: unknown }>;
}

const OPTION_LABEL = ["a", "b", "c"];

/** The picked option index the runner stores; anything else is blank. */
function pickedIndex(value: unknown): number | null {
  const chosen = (value as { chosen?: unknown } | undefined)?.chosen;
  return typeof chosen === "number" ? chosen : null;
}

/**
 * A three-option inventory has no right answer, so this table shows the
 * statement, the option the participant picked, and the factor it feeds —
 * never "Benar/Salah".
 */
export function OptionScaleDetailTable({ items, responses }: OptionScaleDetailTableProps) {
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
                <TableHead>Jawaban</TableHead>
                <TableHead className="w-24">Faktor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const picked = pickedIndex(responseMap.get(item.id));
                const option = picked === null ? null : (item.content.options?.[picked] ?? null);
                return (
                  <TableRow key={item.order}>
                    <TableCell className="tabular-nums">{item.order}</TableCell>
                    <TableCell className="whitespace-pre-wrap text-sm">
                      {item.content.text ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {picked === null || !option ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <>
                          <span className="font-medium">{OPTION_LABEL[picked] ?? picked}.</span>{" "}
                          {option}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.content.scale ?? "—"}
                      {item.content.reverse && (
                        <span className="ml-1 text-xs text-muted-foreground">(R)</span>
                      )}
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
