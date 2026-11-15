import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** One subtest as the scorer stores it. */
export interface MultiSubtestSectionScore {
  code: string;
  name: string;
  correct: number;
  answered: number;
  items: number;
  /** The value the standard table is read with (GE: the converted 1–20). */
  raw: number;
  standardScore: number | null;
  category: string | null;
}

/** `scores` of a MULTI_SUBTEST result. */
export interface MultiSubtestScores {
  ageBand: string | null;
  sections: MultiSubtestSectionScore[];
  totalRaw: number;
  iq: number | null;
  iqCategory: string | null;
  dominance: string | null;
  dominanceGap: number | null;
}

/**
 * A result's `scores` are whatever the family wrote, so the page asks before it
 * draws. A battery always writes nine per-subtest rows beside one total.
 */
export function isMultiSubtestScores(scores: unknown): scores is MultiSubtestScores {
  const value = scores as Partial<MultiSubtestScores> | undefined;
  return (
    Array.isArray(value?.sections) &&
    value.sections.length > 0 &&
    typeof value.totalRaw === "number"
  );
}

/**
 * The battery's profile: an IQ for the cover and a standard score per subtest.
 * The profile is what the psychologist reads — two participants with the same
 * total can have very different shapes.
 */
export function MultiSubtestProfileCard({ scores }: { scores: MultiSubtestScores }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profil subtes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="IQ" value={scores.iq === null ? "—" : String(scores.iq)} strong />
          <Stat label="Kategori" value={scores.iqCategory ?? "—"} />
          <Stat label="Total skor" value={String(scores.totalRaw)} />
          <Stat
            label="Kelompok umur"
            value={scores.ageBand === null ? "tidak tercatat" : `${scores.ageBand} tahun`}
          />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-16">Kode</TableHead>
                <TableHead>Subtes</TableHead>
                <TableHead className="w-24 text-right">Benar</TableHead>
                <TableHead className="w-24 text-right">Skor</TableHead>
                <TableHead className="w-28 text-right">SW</TableHead>
                <TableHead className="w-36">Kategori</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.sections.map((section) => (
                <TableRow key={section.code}>
                  <TableCell className="font-mono text-xs">{section.code}</TableCell>
                  <TableCell>{section.name}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {section.correct} / {section.items}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{section.raw}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {section.standardScore ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {section.category ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Dominasi berpikir:{" "}
          <span className="font-medium text-foreground">{scores.dominance ?? "—"}</span>
          {scores.dominanceGap !== null && (
            <> · selisih {scores.dominanceGap} poin antara skor eksak dan non-eksak</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-primary/5 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("truncate tabular-nums", strong ? "text-xl font-semibold" : "text-sm")}>
        {value}
      </p>
    </div>
  );
}
