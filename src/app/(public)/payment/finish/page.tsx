import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { roleHome } from "@/features/auth/redirect";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Pembayaran" };

/**
 * Snap `callbacks.finish` target. Midtrans appends `order_id`,
 * `status_code` and `transaction_status`, but the invoice status is owned by
 * the webhook — so this page only routes the buyer back to their home, where
 * the paid session already shows up.
 */
export default async function PaymentFinishPage() {
  const session = await getServerSession();
  redirect(session ? roleHome(session.user.role) : "/masuk");
}
