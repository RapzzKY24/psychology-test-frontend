import { Check, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subtestRanges } from "@/lib/multi-subtest";

interface MultiSubtestItem {
  id: string;
  order: number;
  content: Record<string, unknown>;
}

interface MultiSubtestDetailTableProps {
  items: MultiSubtestItem[];
  responses: Array<{ itemId: string; value: unknown }>;
  /** The seed's config: the only place the subtest split is written down. */
  scoringConfig: unknown;
}

/** What the item printed, short enough for one cell. */
function promptOf(content: Record<string, unknown>): string {
  if (typeof content.prompt === "string" && content.prompt) return content.prompt;
  if (Array.isArray(content.words)) return (content.words as string[]).join(" · ");
  if (Array.isArray(content.series)) return (content.series as number[]).join("  ");
  return "";
}

/** The key as the answer sheet reads it. */
function keyOf(content: Record<string, unknown>): string {
  if (content.kind === "PAIR") return "rubrik";
  if (typeof content.key === "number") return String(content.key);
  if (typeof content.key === "string") return content.key.toUpperCase();
  return "—";
}

function answerOf(value: unknown): string {
  const answer = (value as { answer?: unknown } | undefined)?.answer;
  return typeof answer === "string" ? answer : "";
}

/**
 * A letter is right when it is the key's letter — the same comparison the
 * scorer makes, with nothing added. A number is left to the reader: the scorer
 * reads Indonesian notation, and a second implementation here could disagree
 * with it.
 */
function isCorrect(content: Record<string, unknown>, answer: string): boolean | null {
  const key = content.key;
  if (typeof key !== "string") return null;
  if (!answer) return false;
  return answer.trim().toLowerCase() === key;
}

/**
 * 176 answers across nine subtests. A flat list would be unreadable and would
 * hide the only thing this screen is for: which subtest the participant lost
 * points on.
 */
export function MultiSubtestDetailTable({
  items,
  responses,
  scoringConfig,
}: MultiSubtestDetailTableProps) {
  const answers = new Map(responses.map((row) => [row.itemId, row.value]));
  const ranges = subtestRanges(scoringConfig);

  if (ranges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jawaban per soal</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Konfigurasi subtes tidak terbaca, jadi jawaban tidak bisa dikelompokkan.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ranges.map(({ section, from, to }) => {
        const rows = items.filter((item) => item.order >= from && item.order <= to);
        return (
          <Card key={section.code}>
            <CardHeader>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <CardTitle className="text-base">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                    {section.code}
                  </span>
                  {section.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Soal {from}–{to} · {section.timeLimitMin} menit
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-14">No</TableHead>
                      <TableHead>Soal</TableHead>
                      <TableHead className="w-56">Jawaban</TableHead>
                      <TableHead className="w-20 text-right">Kunci</TableHead>
                      <TableHead className="w-14" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((item) => {
                      const answer = answerOf(answers.get(item.id));
                      const correct = isCorrect(item.content, answer);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="tabular-nums text-muted-foreground">
                            {item.order}
                          </TableCell>
                          <TableCell>
                            <span className="line-clamp-2">{promptOf(item.content)}</span>
                          </TableCell>
                          <TableCell className="font-medium">
                            {answer ? (
                              answer
                            ) : (
                              <span className="text-muted-foreground">kosong</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {keyOf(item.content)}
                          </TableCell>
                          <TableCell>
                            {correct === null ? (
                              <Minus
                                className="size-4 text-muted-foreground"
                                aria-label="dinilai rubrik"
                              />
                            ) : correct ? (
                              <Check className="size-4 text-primary" aria-label="benar" />
                            ) : (
                              <span className="text-xs text-muted-foreground" aria-label="salah">
                                —
                              </span>
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
      })}
    </div>
  );
}
