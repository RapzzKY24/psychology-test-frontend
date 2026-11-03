"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckoutStateCardProps {
  state: "loading" | "error" | "unavailable";
  /** Error only: the retry request is in flight. */
  isRetrying?: boolean;
  onRetry?: () => void;
}

/**
 * The three non-form states of the checkout page. One component keeps the
 * layout identical between them — the page only decides which state it is in.
 */
export function CheckoutStateCard({ state, isRetrying, onRetry }: CheckoutStateCardProps) {
  if (state === "loading") {
    return (
      <Card>
        <CardContent className="space-y-2 py-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const isError = state === "error";

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <AlertCircle className="text-destructive size-6" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium">{isError ? "Gagal memuat data tes" : "Tes tidak tersedia"}</p>
          {!isError && (
            <p className="text-muted-foreground text-sm">
              Tes ini belum dijual atau sudah diarsipkan.
            </p>
          )}
        </div>
        {isError ? (
          <Button variant="outline" onClick={onRetry} disabled={isRetrying}>
            {isRetrying ? "Memuat…" : "Coba lagi"}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/tes">Kembali ke katalog</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
