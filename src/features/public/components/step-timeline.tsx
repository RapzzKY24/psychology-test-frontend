import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  body: string;
}

interface StepTimelineProps {
  steps: readonly TimelineStep[];
  /** `5` gives one row on large screens; the default wraps at two. */
  columns?: 2 | 3 | 5;
  className?: string;
}

const COLUMNS_CLASS: Record<NonNullable<StepTimelineProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  5: "sm:grid-cols-2 lg:grid-cols-5",
};

/** Numbered flow. Cards keep the body readable at every width. */
export function StepTimeline({ steps, columns = 2, className }: StepTimelineProps) {
  return (
    <ol className={cn("grid gap-4", COLUMNS_CLASS[columns], className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="bg-card relative rounded-2xl border p-4 sm:p-5">
          <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
            {index + 1}
          </span>
          <p className="mt-3 text-sm font-semibold leading-snug">{step.title}</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
