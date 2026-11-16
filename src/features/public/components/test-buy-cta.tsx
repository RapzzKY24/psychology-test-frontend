"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PersonalCheckoutButton } from "@/features/checkout/components/personal-checkout-button";
import type { UserRole } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { useAgeGate } from "./age-gate";

interface TestBuyCtaProps {
  testId: string;
  testName: string;
  /** null = signed-out visitor. */
  role: UserRole | null;
  className?: string;
}

/**
 * Single buy action for the public catalog and the test detail page: the
 * destination depends on who is looking (institution checkout vs personal
 * checkout vs sign-in). When the test has an age band, the button stays shut
 * until the gate card confirms the participant fits it — institutions buy for
 * a roster, so they pass through.
 */
export function TestBuyCta({ testId, testName, role, className }: TestBuyCtaProps) {
  const { band, status } = useAgeGate();
  const blocked = Boolean(band) && role !== "INSTANSI" && status !== "inside";

  if (blocked) {
    return (
      <Button disabled className={cn("rounded-full", className)}>
        {status === "unknown" ? "Isi tanggal lahir dulu" : "Usia tidak sesuai norma"}
      </Button>
    );
  }

  if (role === "INSTANSI") {
    return (
      <Button asChild className={cn("rounded-full", className)}>
        <Link href={`/instansi/buat-sesi?testId=${testId}`}>Beli &amp; Bayar</Link>
      </Button>
    );
  }

  if (role) {
    return (
      <PersonalCheckoutButton
        testId={testId}
        testName={testName}
        className={className}
      />
    );
  }

  return (
    <Button asChild className={cn("rounded-full", className)}>
      <Link href="/masuk">Beli Tes</Link>
    </Button>
  );
}
