"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckoutStatusResult } from "@/lib/api/types";
import { useCheckoutStatus } from "../hooks/use-checkout-status";
import { useReconcileCheckout } from "../hooks/use-reconcile-checkout";
import {
  CHECKOUT_VIEW_COPY,
  primaryCheckoutAction,
  resolveCheckoutView,
} from "../checkout-result-view";
import { CheckoutStatusIcon } from "./checkout-status-icon";
import { CheckoutSummary } from "./checkout-summary";

interface CheckoutResultProps {
  initial: CheckoutStatusResult;
  /** `transaction_status` from the Snap finish redirect — a hint, never proof. */
  hint?: string;
}

/**
 * Payment result page. It never claims success from the redirect alone: the
 * invoice/order status in the database decides, the Snap hint only explains why
 * a paid transaction may still read as unpaid.
 *
 * An unpaid checkout is checked against the gateway once on open — the Snap
 * webhook cannot reach a local host, so without this the page would sit on
 * "waiting" until the recovery pass happened to run.
 */
export function CheckoutResult({ initial, hint }: CheckoutResultProps) {
  const query = useCheckoutStatus(initial);
  const checkout = query.data;
  const view = resolveCheckoutView(checkout, hint);
  const copy = CHECKOUT_VIEW_COPY[view];
  const action = primaryCheckoutAction(checkout, view);
  const { mutate: reconcileNow, isPending } = useReconcileCheckout(checkout.id);

  const checkedOnOpen = useRef(false);
  useEffect(() => {
    if (checkedOnOpen.current || checkout.status !== "UNPAID") return;
    checkedOnOpen.current = true;
    reconcileNow();
  }, [checkout.status, reconcileNow]);

  const dashboardHref = checkout.kind === "invoice" ? "/instansi" : "/dashboard";
  // Only hidden when the primary action already is that dashboard link.
  const showDashboardLink = action.kind === "reconcile" || action.href !== dashboardHref;

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        {/* The asset is a 3.4:1 wordmark, so it keeps its ratio: a square box
            with object-cover would crop the mark and upscale it into a blur. */}
        <Image
          src="/logo/logopsikologi.jpeg"
          alt="Psikotes"
          width={173}
          height={50}
          priority
          className="h-10 w-auto"
        />

        <CheckoutStatusIcon view={view} />

        <div className="space-y-1">
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <p className="text-muted-foreground text-sm">{copy.body}</p>
        </div>

        <CheckoutSummary testNames={checkout.testNames} amount={checkout.amount} />

        {action.kind === "reconcile" ? (
          <Button className="w-full" onClick={() => reconcileNow()} disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="size-4" aria-hidden />
            )}
            {isPending ? "Mengecek status…" : action.label}
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}

        {showDashboardLink && (
          <Button asChild variant="ghost" className="w-full">
            <Link href={dashboardHref}>Ke dashboard</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
