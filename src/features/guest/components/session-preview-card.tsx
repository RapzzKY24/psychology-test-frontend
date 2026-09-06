import { CalendarDays, Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionPreview } from "../schemas";

export function SessionPreviewCard({ preview }: { preview: SessionPreview }) {
  const slotsLeft = Math.max(preview.slotLimit - preview.slotsUsed, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{preview.title}</CardTitle>
          {preview.requiresPin && (
            <Badge variant="outline" className="shrink-0 border-chart-3/40 bg-chart-3/15">
              <Lock className="size-3" aria-hidden />
              PIN
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden />
            Berlaku s.d. {new Date(preview.expiresAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            Sisa {slotsLeft} dari {preview.slotLimit} slot
          </span>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tes yang dikerjakan (berurutan)
          </p>
          <ol className="space-y-1.5">
            {preview.tests.map((test) => (
              <li
                key={`${test.order}-${test.testName}`}
                className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary tabular-nums">
                  {test.order}
                </span>
                {test.testName}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
