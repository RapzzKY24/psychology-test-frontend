import { Check } from "lucide-react";
import { PUBLIC_COPY } from "../copy";

/** The practical preparation list, before the participant clicks start. */
export function TestBeforeStart() {
  const copy = PUBLIC_COPY.testDetail;

  return (
    <section aria-labelledby="sebelum-mulai" className="space-y-3">
      <h2 id="sebelum-mulai" className="text-lg font-semibold">
        {copy.beforeStartTitle}
      </h2>
      <ul className="bg-card grid gap-2 rounded-2xl border p-5 sm:grid-cols-2">
        {copy.beforeStart.map((item) => (
          <li key={item} className="text-muted-foreground flex items-start gap-2 text-sm">
            <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
              <Check className="size-3" aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
