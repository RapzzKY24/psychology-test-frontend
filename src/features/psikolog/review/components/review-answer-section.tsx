import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReviewDetail } from "@/lib/api/types";
import { RightWrongDetailTable } from "./right-wrong-detail-table";

interface ReviewAnswerSectionProps {
  detail: ReviewDetail;
  scores: Record<string, number>;
}

/**
 * Right/wrong families get the per-item table; DISC falls back to the
 * word/most/least table built from `itemsDetailed`.
 */
export function ReviewAnswerSection({ detail, scores }: ReviewAnswerSectionProps) {
  const firstContent = detail.items[0]?.content as unknown as { correctIndex?: number } | undefined;

  if (typeof firstContent?.correctIndex === "number") {
    return (
      <RightWrongDetailTable
        items={
          detail.items as unknown as Array<{
            id: string;
            order: number;
            content: {
              question?: string | null;
              imageUrl?: string | null;
              options: string[];
              correctIndex: number;
            };
          }>
        }
        responses={detail.responses as unknown as Array<{ itemId: string; value: { chosen: number } }>}
        scores={scores as unknown as { raw: number; total: number; perItem: boolean[] } | undefined}
      />
    );
  }

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
                <TableHead>Kata</TableHead>
                <TableHead>Paling</TableHead>
                <TableHead>Kurang</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.itemsDetailed.map((item) => (
                <TableRow key={item.itemOrder}>
                  <TableCell className="tabular-nums">{item.itemOrder}</TableCell>
                  <TableCell>{item.words.join(" · ")}</TableCell>
                  <TableCell className="tabular-nums">{item.most ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">{item.least ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
