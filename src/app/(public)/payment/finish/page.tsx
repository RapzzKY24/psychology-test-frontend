import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchCheckoutStatusServer } from "@/features/checkout/api.server";
import { roleHome } from "@/features/auth/redirect";
import { isApiError } from "@/lib/api/client";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Pembayaran" };

/**
 * Snap `callbacks.finish` target. Midtrans appends `order_id`,
 * `status_code` and `transaction_status`; the id is resolved to the buyer's
 * own invoice/order so the result page can show it. Unknown ids fall back to
 * the role home instead of a dead end.
 */
export default async function PaymentFinishPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[]; transaction_status?: string | string[] }>;
}) {
  const sp = await searchParams;
  const session = await getServerSession();
  if (!session) redirect("/masuk");

  const orderId = Array.isArray(sp.order_id) ? sp.order_id[0] : sp.order_id;
  const transactionStatus = Array.isArray(sp.transaction_status)
    ? sp.transaction_status[0]
    : sp.transaction_status;

  let target: string | null = null;
  if (orderId) {
    try {
      const { data } = await fetchCheckoutStatusServer(orderId);
      const hint = transactionStatus ? `?hint=${encodeURIComponent(transactionStatus)}` : "";
      target = `/pembayaran/${data.id}${hint}`;
    } catch (error) {
      if (!(isApiError(error) && error.isNotFound)) throw error;
    }
  }

  redirect(target ?? roleHome(session.user.role));
}
