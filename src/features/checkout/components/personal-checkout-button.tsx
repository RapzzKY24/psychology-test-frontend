"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import { createOrder } from "../api";
import { PaymentDialog } from "./payment-dialog";

interface PersonalCheckoutButtonProps {
  testId: string;
  testName: string;
  className?: string;
}

/**
 * "Mulai Tes" for a signed-in participant: opens an order, then hands the id to
 * the payment dialog. The order is created on click, never on page load, so a
 * visitor who only reads the page leaves no rows behind.
 */
export function PersonalCheckoutButton({
  testId,
  testName,
  className,
}: PersonalCheckoutButtonProps) {
  const [orderId, setOrderId] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () => createOrder(testId),
    onSuccess: ({ data }) => setOrderId(data.orderId),
    onError: (error) =>
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE),
  });

  return (
    <>
      <Button
        className={cn("rounded-full", className)}
        disabled={create.isPending}
        onClick={() => create.mutate()}
      >
        {create.isPending ? "Menyiapkan…" : "Mulai Tes"}
      </Button>
      <PaymentDialog
        orderId={orderId}
        testName={testName}
        onClose={() => setOrderId(null)}
      />
    </>
  );
}
