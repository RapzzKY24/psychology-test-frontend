import type { PublicTest } from "@/lib/api/types";

/**
 * `GET /instansi/tests` returns the full public DTO (price included) for every
 * published test, so the checkout can read the price without a second call.
 */
export type InstansiTestOption = PublicTest;
