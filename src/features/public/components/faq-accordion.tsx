import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../help-content";

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

/** Native accordion: readable and operable without JavaScript. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="bg-card divide-y overflow-hidden rounded-2xl border">
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-medium transition-colors marker:content-none">
            <span className="min-w-0 text-left">{item.q}</span>
            <ChevronDown
              className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
