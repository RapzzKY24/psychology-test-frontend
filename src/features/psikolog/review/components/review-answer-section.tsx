import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReviewDetail, RightWrongItemContent } from "@/lib/api/types";
import { PairDetailTable } from "./pair-detail-table";
import { RightWrongDetailTable } from "./right-wrong-detail-table";

/** The table takes the item/response slices it renders, not the whole review. */
interface RightWrongItem {
  id: string;
  order: number;
  content: RightWrongItemContent;
}

interface RightWrongResponseRow {
  itemId: string;
  value: unknown;
}

interface ReviewAnswerSectionProps {
  detail: ReviewDetail;
  scores: Record<string, number>;
}

/**
 * Right/wrong families get the per-item table; DISC falls back to the
 * word/most/least table built from `itemsDetailed`.
 */
export function ReviewAnswerSection({ detail, scores }: ReviewAnswerSectionProps) {
  // DISC items carry `words`; every right/wrong item carries options or an
  // accepted-answer list, so the key field is not a reliable marker any more.
  const firstContent = detail.items[0]?.content as unknown as
    | { words?: unknown; statements?: unknown }
    | undefined;

  if (detail.items.length > 0 && Array.isArray(firstContent?.statements)) {
    return (
      <PairDetailTable
        items={detail.items as unknown as Parameters<typeof PairDetailTable>[0]["items"]}
        responses={detail.responses as unknown as Parameters<typeof PairDetailTable>[0]["responses"]}
      />
    );
  }

  const isDisc = Array.isArray(firstContent?.words);

  if (detail.items.length > 0 && !isDisc) {
    return (
      <RightWrongDetailTable
        items={detail.items as unknown as RightWrongItem[]}
        responses={detail.responses as unknown as RightWrongResponseRow[]}
        scores={
          scores as unknown as { raw: number; total: number; perItem: boolean[] } | undefined
        }
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
