import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewScoreCardsProps {
  patternCode: string;
  scores: Record<string, number>;
  correctedPatternCode?: string | null;
  correctedScores?: Record<string, number> | null;
  correctionReason?: string | null;
}

/** System score beside the psychologist's correction, if any. */
export function ReviewScoreCards({
  patternCode,
  scores,
  correctedPatternCode,
  correctedScores,
  correctionReason,
}: ReviewScoreCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skor sistem</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <p>
            Pola: <span className="font-mono font-medium">{patternCode}</span>
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-xs">
            {JSON.stringify(scores, null, 2)}
          </pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Koreksi psikolog</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          {correctedPatternCode ? (
            <>
              <p>
                Pola: <span className="font-mono font-medium">{correctedPatternCode}</span>
              </p>
              <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-xs">
                {JSON.stringify(correctedScores, null, 2)}
              </pre>
              {correctionReason && <p className="text-muted-foreground">{correctionReason}</p>}
            </>
          ) : (
            <p className="text-muted-foreground">Belum ada koreksi.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
