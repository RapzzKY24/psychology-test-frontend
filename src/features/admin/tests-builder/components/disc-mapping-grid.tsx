"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiscDimension } from "../constants";
import type { BuilderController } from "../hooks/use-builder-form";
import { DiscMappingChips } from "./disc-mapping-chips";

interface DiscMappingGridProps {
  builder: BuilderController;
  active: number;
  mostMapping: DiscDimension[];
  leastMapping: DiscDimension[];
  locked: boolean;
}

const WORD_INDEXES = [0, 1, 2, 3];

/** Most/Least dimension per word, with a shortcut to copy Most into Least. */
export function DiscMappingGrid({
  builder,
  active,
  mostMapping,
  leastMapping,
  locked,
}: DiscMappingGridProps) {
  const { form } = builder;

  const setMapping = (part: "mostMapping" | "leastMapping", wordIdx: number, dim: DiscDimension) =>
    form.setValue(`items.${active}.content.${part}.${wordIdx}`, dim as never, {
      shouldDirty: true,
    });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <p className="text-sm font-medium">
        Mapping per kata{" "}
        <span className="text-muted-foreground">
          (D Dominance · I Influence · S Steadiness · C Compliance · * netral)
        </span>
      </p>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Most</p>
        {WORD_INDEXES.map((wordIdx) => (
          <div key={wordIdx} className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-sm text-muted-foreground">Kata {wordIdx + 1}</span>
            <DiscMappingChips
              prefix="Most"
              wordIndex={wordIdx}
              value={mostMapping[wordIdx] ?? "D"}
              disabled={locked}
              onChange={(dim) => setMapping("mostMapping", wordIdx, dim)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Least</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={locked}
            onClick={() =>
              form.setValue(
                `items.${active}.content.leastMapping`,
                [...mostMapping] as never,
                { shouldDirty: true },
              )
            }
          >
            <Copy className="size-3.5" aria-hidden />
            Samakan dengan Most
          </Button>
        </div>
        {WORD_INDEXES.map((wordIdx) => (
          <div key={wordIdx} className="flex flex-wrap items-center gap-3">
            <span className="w-20 text-sm text-muted-foreground">Kata {wordIdx + 1}</span>
            <DiscMappingChips
              prefix="Least"
              wordIndex={wordIdx}
              value={leastMapping[wordIdx] ?? "D"}
              disabled={locked}
              onChange={(dim) => setMapping("leastMapping", wordIdx, dim)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
