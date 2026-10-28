"use client";

import { DISC_DIMENSIONS } from "../constants";
import type { DiscDimension } from "../constants";
import { cn } from "@/lib/utils";

interface DiscMappingChipsProps {
  prefix: string;
  wordIndex: number;
  value: DiscDimension;
  onChange: (next: DiscDimension) => void;
  disabled: boolean;
}

/** Four D/I/S/C buttons for one word. */
export function DiscMappingChips({
  prefix,
  wordIndex,
  value,
  onChange,
  disabled,
}: DiscMappingChipsProps) {
  return (
    <div className="flex gap-1" role="group" aria-label={`${prefix} kata ${wordIndex + 1}`}>
      {DISC_DIMENSIONS.map((dim) => (
        <button
          key={dim}
          type="button"
          disabled={disabled}
          aria-pressed={value === dim}
          aria-label={`${prefix} kata ${wordIndex + 1}: ${dim}`}
          onClick={() => onChange(dim)}
          className={cn(
            "size-7 rounded-md border text-xs font-medium transition-colors",
            value === dim
              ? "border-primary bg-primary text-primary-foreground"
              : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
        >
          {dim}
        </button>
      ))}
    </div>
  );
}
