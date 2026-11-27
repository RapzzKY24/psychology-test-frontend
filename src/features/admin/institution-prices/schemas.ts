/**
 * The price editor is a table of optional inputs, so the draft is a
 * `testId -> raw string` map. Conversion happens here (pure) so it can be
 * unit-tested and the component stays presentational.
 */
export interface DealPricePayload {
  prices: Array<{ testId: string; price: number }>;
  invalidTestIds: string[];
}

export function buildDealPriceDraft(
  rows: Array<{ testId: string; dealPrice: number | null }>,
): Record<string, string> {
  return Object.fromEntries(
    rows.map((row) => [row.testId, row.dealPrice?.toString() ?? ""]),
  );
}

export function toDealPricePayload(
  draft: Record<string, string>,
): DealPricePayload {
  const prices: DealPricePayload["prices"] = [];
  const invalidTestIds: string[] = [];

  for (const [testId, raw] of Object.entries(draft)) {
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    const value = Number(trimmed);
    if (!Number.isInteger(value) || value < 1) {
      invalidTestIds.push(testId);
      continue;
    }
    prices.push({ testId, price: value });
  }

  return { prices, invalidTestIds };
}
