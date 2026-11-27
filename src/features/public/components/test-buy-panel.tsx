import { Check, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIdr } from "@/lib/format/format-idr";
import type { PublicTestWithDeal, UserRole } from "@/lib/api/types";
import { AgeGateCard } from "./age-gate";
import { TestBuyCta } from "./test-buy-cta";

const INCLUDES = [
  "Laporan hasil dalam format PDF",
  "Diverifikasi psikolog berlisensi",
  "QR verifikasi keaslian laporan",
] as const;

interface BuyProps {
  test: PublicTestWithDeal;
  /** null = signed-out visitor. */
  role: UserRole | null;
}

/** Sticky price card on the detail page (desktop). */
export function TestBuyPanel({ test, role }: BuyProps) {
  return (
    <Card className="sticky top-24 rounded-2xl">
      <CardContent className="space-y-5">
        <div>
          <p className="text-muted-foreground text-sm">Biaya asesmen</p>
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="font-heading text-3xl font-semibold tracking-tight">
              {formatIdr(test.price)}
            </p>
            {test.hasDealPrice && test.basePrice != null && (
              <span className="text-muted-foreground text-sm line-through">
                {formatIdr(test.basePrice)}
              </span>
            )}
          </div>
          {test.hasDealPrice && (
            <Badge variant="secondary" className="mt-1.5">
              Harga Khusus
            </Badge>
          )}
          <p className="text-muted-foreground mt-1 text-xs">Biaya sudah termasuk laporan hasil.</p>
        </div>

        <AgeGateCard role={role} />

        <TestBuyCta
          testId={test.id}
          testName={test.name}
          testSlug={test.slug}
          role={role}
          className="w-full"
        />

        <ul className="space-y-2.5 border-t pt-4">
          {INCLUDES.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          Hasil hanya bisa dibuka oleh Anda.
        </p>
      </CardContent>
    </Card>
  );
}

/** Fixed price bar on mobile, where the panel is hidden. */
export function TestBuyBar({ test, role }: BuyProps) {
  return (
    <div className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t p-4 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs">Biaya</p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold">{formatIdr(test.price)}</p>
            {test.hasDealPrice && test.basePrice != null && (
              <span className="text-muted-foreground text-xs line-through">
                {formatIdr(test.basePrice)}
              </span>
            )}
          </div>
        </div>
        <TestBuyCta
          testId={test.id}
          testName={test.name}
          testSlug={test.slug}
          role={role}
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
}
