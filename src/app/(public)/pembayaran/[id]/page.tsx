import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckoutResult } from "@/features/checkout/components/checkout-result";
import { fetchCheckoutStatusServer } from "@/features/checkout/api.server";
import { isApiError } from "@/lib/api/client";
import { getServerSession } from "@/lib/api/server";
import type { CheckoutStatusResult } from "@/lib/api/types";

export const metadata: Metadata = { title: "Status Pembayaran" };

/**
 * Payment result for both flows: a prepaid instansi invoice or a personal
 * order. `hint` is the Snap `transaction_status` forwarded by /payment/finish;
 * the database still decides the real state.
 */
export default async function PembayaranPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hint?: string | string[] }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const session = await getServerSession();
  if (!session) redirect(`/masuk?next=${encodeURIComponent(`/pembayaran/${id}`)}`);

  let checkout: CheckoutStatusResult;
  try {
    checkout = (await fetchCheckoutStatusServer(id)).data;
  } catch (error) {
    if (isApiError(error) && error.isNotFound) notFound();
    throw error;
  }

  const hint = Array.isArray(sp.hint) ? sp.hint[0] : sp.hint;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <CheckoutResult initial={checkout} hint={hint} />
    </main>
  );
}
