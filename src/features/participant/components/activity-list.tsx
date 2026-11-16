import Link from "next/link";
import { Award, CheckCircle2, FileCheck2, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatIdDate } from "@/lib/format/format-date";
import { formatIdr } from "@/lib/format/format-idr";
import type { ActivityItem } from "../activity";

interface ActivityView {
  icon: LucideIcon;
  text: string;
  hint?: string;
  action?: { href: string; label: string };
}

function describe(item: ActivityItem): ActivityView {
  switch (item.kind) {
    case "ORDER_PAID":
      return {
        icon: Wallet,
        text: `Pembayaran ${item.testName} diterima`,
        hint: formatIdr(item.amount),
      };
    case "ATTEMPT_COMPLETED":
      return { icon: CheckCircle2, text: `Tes ${item.testName} selesai` };
    case "RESULT_APPROVED":
      return {
        icon: FileCheck2,
        text: `Hasil ${item.testName} disetujui psikolog`,
        action: { href: `/hasil/${item.attemptId}`, label: "Lihat hasil" },
      };
    case "CERTIFICATE_ISSUED":
      return {
        icon: Award,
        text: `Sertifikat ${item.testName} terbit`,
        hint: item.number,
        action: { href: "/dashboard/sertifikat", label: "Lihat sertifikat" },
      };
  }
}

function keyOf(item: ActivityItem, index: number): string {
  const id =
    item.kind === "ORDER_PAID"
      ? item.testName
      : item.kind === "CERTIFICATE_ISSUED"
        ? item.number
        : item.attemptId;
  return `${item.kind}-${id}-${index}`;
}

export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Belum ada aktivitas. Kejadian terbaru muncul di sini.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-lg border">
      {items.map((item, index) => {
        const view = describe(item);
        const Icon = view.icon;
        return (
          <li key={keyOf(item, index)} className="flex items-center gap-3 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">{view.text}</p>
              <p className="text-xs text-muted-foreground">
                {formatIdDate(item.at)}
                {view.hint ? ` · ${view.hint}` : ""}
              </p>
            </div>
            {view.action && (
              <Link
                href={view.action.href}
                className="shrink-0 text-sm font-medium text-primary hover:underline"
              >
                {view.action.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
