import Link from "next/link";
import {
  Award,
  CreditCard,
  FileCheck2,
  LayoutGrid,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MeOverview } from "@/lib/api/types";

interface Shortcut {
  href: string;
  label: string;
  icon: LucideIcon;
  /** The one action worth doing right now gets the filled button. */
  emphasis?: boolean;
}

/**
 * A shortcut only appears when the row behind it exists, so the strip never
 * sends a participant to an empty list. "Mulai tes baru" is always there:
 * buying another test is valid whatever else is on the screen.
 */
export function QuickActions({ overview }: { overview: MeOverview }) {
  const { counts, activeAttempts, latestResults } = overview;
  const shortcuts: Shortcut[] = [];

  if (counts.inProgress > 0 && activeAttempts[0]) {
    shortcuts.push({
      href: `/tes/kerjakan/${activeAttempts[0].attemptId}`,
      label: "Lanjutkan tes",
      icon: PlayCircle,
      emphasis: true,
    });
  }
  if (counts.pendingOrders > 0) {
    shortcuts.push({
      href: "/dashboard/pembelian?status=PENDING",
      label: "Selesaikan pembayaran",
      icon: CreditCard,
    });
  }
  if (counts.resultsReady > 0 && latestResults[0]) {
    shortcuts.push({
      href: `/hasil/${latestResults[0].attemptId}`,
      label: "Lihat hasil",
      icon: FileCheck2,
    });
  }
  if (counts.certificatesReady > 0) {
    shortcuts.push({
      href: "/dashboard/sertifikat",
      label: "Sertifikat",
      icon: Award,
    });
  }
  shortcuts.push({ href: "/tes", label: "Mulai tes baru", icon: LayoutGrid });

  return (
    <nav aria-label="Pintasan" className="flex flex-wrap items-center gap-2">
      {shortcuts.map(({ href, label, icon: Icon, emphasis }) => (
        <Button
          key={href}
          asChild
          variant={emphasis ? "default" : "outline"}
          className="h-9 px-3"
        >
          <Link href={href}>
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
