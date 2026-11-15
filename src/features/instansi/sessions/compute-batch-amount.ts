import type { InstansiTestOption } from "./types";

/**
 * Prepaid batch total: Σ(test price) × slotLimit.
 *
 * Slots are billed up front (owner decision #6), so an empty roster still owes
 * the full amount. Non-integer or negative slot input yields 0 instead of NaN.
 */
export function computeBatchAmount(tests: InstansiTestOption[], slotLimit: number): number {
  const slots = Math.trunc(slotLimit);
  if (!Number.isFinite(slots) || slots < 1 || tests.length === 0) return 0;
  const pricePerSeat = tests.reduce((sum, test) => sum + test.price, 0);
  return pricePerSeat * slots;
}
