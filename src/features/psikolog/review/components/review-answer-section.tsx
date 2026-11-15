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
import { ChoiceTallyDetailTable } from "./choice-tally-detail-table";
import { LikertDetailTable } from "./likert-detail-table";
import { ManualDetailGrid } from "./manual-detail-grid";
import { OptionScaleDetailTable } from "./option-scale-detail-table";
import { PairDetailTable, type PairItem, type PairResponseRow } from "./pair-detail-table";
import { RightWrongDetailTable } from "./right-wrong-detail-table";
import { ScaleTallyDetailTable } from "./scale-tally-detail-table";
import { TimedGridDetailTable } from "./timed-grid-detail-table";
import type { TimedGridScores } from "./work-curve-chart";

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
    | {
        words?: unknown;
        statements?: unknown;
        options?: unknown;
        mapping?: unknown;
        scale?: unknown;
        text?: unknown;
        digits?: unknown;
        mark?: unknown;
      }
    | undefined;

  // A drawing sheet carries a printed mark and nothing else; every branch
  // below would print the boxes as unanswered questions.
  if (detail.items.length > 0 && typeof firstContent?.mark === "string") {
    return <ManualDetailGrid items={detail.items} responses={detail.responses} />;
  }

  // A digit grid is the only family whose item is a row of numbers; every
  // other branch below would print it as an unanswered question.
  if (detail.items.length > 0 && Array.isArray(firstContent?.digits)) {
    return <TimedGridDetailTable scores={scores as unknown as TimedGridScores} />;
  }

  // A three-option item also carries `text`, so it has to be recognised before
  // the Likert branch — otherwise every rating column prints "—".
  const isOptionScale =
    detail.items.length > 0 &&
    typeof firstContent?.text === "string" &&
    Array.isArray(firstContent?.options);

  if (isOptionScale) {
    return (
      <OptionScaleDetailTable
        items={detail.items as unknown as Parameters<typeof OptionScaleDetailTable>[0]["items"]}
        responses={detail.responses}
      />
    );
  }

  // Likert items carry `text` + `scale`; they must be checked before the
  // scale-tally branch, which would otherwise claim them by their scale.
  const isLikert = detail.items.length > 0 && typeof firstContent?.text === "string";

  if (isLikert) {
    return (
      <LikertDetailTable
        items={detail.items as unknown as Parameters<typeof LikertDetailTable>[0]["items"]}
        responses={detail.responses}
      />
    );
  }

  if (detail.items.length > 0 && Array.isArray(firstContent?.statements)) {
    return (
      <PairDetailTable
        items={detail.items as unknown as PairItem[]}
        responses={detail.responses as unknown as PairResponseRow[]}
      />
    );
  }

  // Choice-tally items map every option to its own scale, so the scale column
  // has to follow the chosen option rather than the item.
  const isChoiceTally =
    detail.items.length > 0 &&
    Array.isArray(firstContent?.options) &&
    Array.isArray(firstContent?.mapping);

  if (isChoiceTally) {
    return (
      <ChoiceTallyDetailTable
        items={detail.items as unknown as Parameters<typeof ChoiceTallyDetailTable>[0]["items"]}
        responses={detail.responses}
      />
    );
  }

  // Tally items carry the scale they feed; they have no answer key, so the
  // right/wrong table would print "Salah" for every row.
  const isScaleTally = detail.items.length > 0 && typeof firstContent?.scale === "string";

  if (isScaleTally) {
    return (
      <ScaleTallyDetailTable
        items={detail.items as unknown as Parameters<typeof ScaleTallyDetailTable>[0]["items"]}
        responses={detail.responses}
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
