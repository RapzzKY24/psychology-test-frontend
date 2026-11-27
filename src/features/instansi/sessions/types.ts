import type { DealPriceView, PublicTest } from "@/lib/api/types";

/**
 * `GET /instansi/tests` returns the public DTO for every published test with
 * this institution's deal price already applied: `price` is what the
 * institution pays, `basePrice` is the website price for the struck-through
 * reference, and `hasDealPrice` drives the badge.
 */
export type InstansiTestOption = PublicTest & DealPriceView;
