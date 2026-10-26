"use client";

import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatIdr } from "@/lib/format/format-idr";
import { cn } from "@/lib/utils";
import type { InstansiTestOption } from "../api";

interface BatchTestPickerProps {
  tests: InstansiTestOption[];
  selectedIds: string[];
  onToggle: (testId: string) => void;
}

/** Checkbox list of purchasable tests; the whole row is the click target. */
export function BatchTestPicker({ tests, selectedIds, onToggle }: BatchTestPickerProps) {
  if (tests.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Tidak ada tes yang tersedia untuk institusi saat ini.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tests.map((test) => {
        const checked = selectedIds.includes(test.id);
        return (
          <li key={test.id}>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                checked ? "border-primary bg-primary/5" : "hover:bg-muted/60",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(test.id)}
                aria-label={test.name}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{test.name}</span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="size-3" aria-hidden />
                  {test.estimatedDurationMin} menit
                </span>
              </span>
              <span className="text-sm font-medium tabular-nums">{formatIdr(test.price)}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
