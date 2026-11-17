"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthChoiceGroupProps {
  label: string;
  children: ReactNode;
}

/** Radio group wrapper so arrow keys and screen readers read the two answers. */
export function AuthChoiceGroup({ label, children }: AuthChoiceGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-3">
      {children}
    </div>
  );
}

interface AuthChoiceProps {
  icon: LucideIcon;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

/** One answer card. Presentational only: the gateway owns the state. */
export function AuthChoice({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
}: AuthChoiceProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        selected ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 pr-6">
        <span className="block text-base font-semibold leading-snug">{label}</span>
        <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
          {description}
        </span>
      </span>
      {selected ? (
        <Check className="text-primary absolute top-4 right-4 size-5" aria-hidden />
      ) : null}
    </button>
  );
}
