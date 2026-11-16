"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ParticipantTab {
  href: string;
  label: string;
}

export const PARTICIPANT_TABS: ParticipantTab[] = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/riwayat", label: "Riwayat" },
  { href: "/dashboard/pembelian", label: "Pembelian" },
  { href: "/dashboard/sertifikat", label: "Sertifikat" },
  { href: "/dashboard/profil", label: "Profil" },
];

export function isParticipantTabActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

/**
 * Participant tab bar. Sits under ParticipantBar (57px tall including its
 * border) and stays visible while the tab content scrolls.
 */
export function ParticipantTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi dashboard peserta"
      className="sticky top-[57px] z-10 border-b bg-background/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6">
        {PARTICIPANT_TABS.map((tab) => {
          const active = isParticipantTabActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors",
                active
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
