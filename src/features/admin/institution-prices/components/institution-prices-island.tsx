"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { InstitutionTestPriceRow } from "@/lib/api/types";
import type { ApiSuccess } from "@/lib/api/types/pagination";
import { useInstitutionPrices } from "../hooks/use-institution-prices";
import { useSaveInstitutionPrices } from "../hooks/use-save-institution-prices";
import { buildDealPriceDraft, toDealPricePayload } from "../schemas";
import { DEAL_PRICE_PRICE_REQUIRED } from "../constants";
import { InstitutionPricesTable } from "./institution-prices-table";

/**
 * Price editor island: draft lives in local state (UI state, not server
 * state); saving is a replace-all mutation.
 */
export function InstitutionPricesIsland({
  institutionId,
  initial,
}: {
  institutionId: string;
  initial: ApiSuccess<InstitutionTestPriceRow[]>;
}) {
  const { rows } = useInstitutionPrices({ institutionId, initial });
  const save = useSaveInstitutionPrices(institutionId);
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    buildDealPriceDraft(initial.data),
  );

  const { prices, invalidTestIds } = toDealPricePayload(draft);
  const invalid = new Set(invalidTestIds);

  const onDraftChange = (testId: string, value: string) => {
    setDraft((current) => ({ ...current, [testId]: value }));
  };

  return (
    <div className="space-y-3">
      <InstitutionPricesTable
        rows={rows}
        draft={draft}
        invalidTestIds={invalid}
        onDraftChange={onDraftChange}
      />
      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground max-w-prose text-sm">
          Kosongkan kolom untuk memakai harga website. Perubahan hanya berlaku
          untuk checkout berikutnya — invoice lama tidak berubah.
        </p>
        <Button
          onClick={() => save.mutate({ prices })}
          disabled={save.isPending || invalid.size > 0}
          className="w-full shrink-0 text-center sm:w-auto"
        >
          {save.isPending ? "Menyimpan…" : "Simpan Harga"}
        </Button>
      </div>
      {invalid.size > 0 && (
        <p role="alert" className="text-destructive text-sm">
          {DEAL_PRICE_PRICE_REQUIRED}
        </p>
      )}
    </div>
  );
}
