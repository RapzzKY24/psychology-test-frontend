import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface TestBuyCtaProps {
  testId: string;
  /** null = signed-out visitor. */
  role: UserRole | null;
  className?: string;
}

/**
 * Single buy action for the public catalog and the test detail page: the
 * destination depends on who is looking (institution checkout vs personal
 * dashboard vs sign-in).
 */
export function TestBuyCta({ testId, role, className }: TestBuyCtaProps) {
  if (role === "INSTANSI") {
    return (
      <Button asChild className={cn("rounded-full", className)}>
        <Link href={`/instansi/buat-sesi?testId=${testId}`}>Beli &amp; Bayar</Link>
      </Button>
    );
  }

  if (role) {
    return (
      <Button asChild className={cn("rounded-full", className)}>
        <Link href="/dashboard">Mulai Tes</Link>
      </Button>
    );
  }

  return (
    <Button asChild className={cn("rounded-full", className)}>
      <Link href="/masuk">Beli Tes</Link>
    </Button>
  );
}
