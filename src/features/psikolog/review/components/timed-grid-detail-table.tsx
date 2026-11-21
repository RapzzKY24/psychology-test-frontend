"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TimedGridScores } from "../lib/timed-grid-scores";

/**
 * Per-lajur tally. The scorer already decided what is right, wrong and
 * skipped, so this only lays the numbers out — re-deriving them here would let
 * the table and the curve disagree.
 */
export function TimedGridDetailTable({ scores }: { scores: TimedGridScores }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rincian per lajur</CardTitle>
        <p className="text-sm text-muted-foreground">
          {scores.total} lajur · {scores.gaps} kotak · {scores.correct} benar ·{" "}
          {scores.wrong} salah · {scores.skipped} terlewati
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-16">Lajur</TableHead>
                <TableHead className="w-20 text-right">Kotak</TableHead>
                <TableHead className="w-20 text-right">Benar</TableHead>
                <TableHead className="w-20 text-right">Salah</TableHead>
                <TableHead className="w-24 text-right">Terlewati</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.columns.map((column) => (
                <TableRow key={column.column}>
                  <TableCell className="tabular-nums">{column.column}</TableCell>
                  <TableCell className="text-right tabular-nums">{column.gaps}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {column.correct}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{column.wrong}</TableCell>
                  <TableCell className="text-right tabular-nums">{column.skipped}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
