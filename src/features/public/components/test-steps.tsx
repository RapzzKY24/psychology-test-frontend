import { PUBLIC_COPY } from "../copy";
import { StepTimeline } from "./step-timeline";

/** "Cara Kerja" — four steps that match what actually happens after payment. */
export function TestSteps() {
  const copy = PUBLIC_COPY.testDetail;

  return (
    <section aria-labelledby="cara-kerja" className="space-y-4">
      <h2 id="cara-kerja" className="text-lg font-semibold">
        {copy.stepsTitle}
      </h2>
      <StepTimeline steps={copy.steps} columns={2} />
    </section>
  );
}
