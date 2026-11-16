"use client";

import { useState } from "react";
import { PaymentDialog } from "./payment-dialog";

const ACTION_LINK = "text-sm font-medium text-primary hover:underline";

/**
 * "Bayar" on the purchase tab: an unpaid order already exists, so the dialog
 * opens straight onto it instead of creating a second one.
 */
export function PayOrderButton({
  orderId,
  testName,
  label = "Bayar",
}: {
  orderId: string;
  testName: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={ACTION_LINK} onClick={() => setOpen(true)}>
        {label}
      </button>
      <PaymentDialog
        orderId={open ? orderId : null}
        testName={testName}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
