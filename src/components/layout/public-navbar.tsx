"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/api/auth-client";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/api/types";

const NAV_LINKS = [
  { href: "/tes", label: "Tes" },
  { href: "/artikel", label: "Artikel" },
  { href: "/untuk-perusahaan", label: "Untuk Perusahaan" },
] as const;

/** Role → the console the navbar links to, with the label shown next to it. */
const DASHBOARD_ENTRY: Record<UserRole, { label: string; href: string; icon: LucideIcon }> = {
  INSTANSI: { label: "Instansi", href: "/instansi", icon: Building2 },
  ADMIN: { label: "Admin", href: "/admin", icon: ShieldCheck },
  PSYCHOLOGIST: { label: "Psikolog", href: "/psikolog", icon: Stethoscope },
  PARTICIPANT: { label: "Peserta", href: "/dashboard", icon: UserRound },
};

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Brand() {
  return (
    <Link href="/" className="flex items-center" aria-label="Psikotes — beranda">
      <Image
        src="/logo/logopsikologi.jpeg"
        alt="Psikotes"
        width={173}
        height={50}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}

/** Role chip + the way into that role's console. */
function DashboardEntry({ entry }: { entry: (typeof DASHBOARD_ENTRY)[UserRole] }) {
  const Icon = entry.icon;

  return (
    <div className="hidden items-center gap-2 md:flex">
      <span className="text-muted-foreground bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
        <Icon className="text-primary size-3.5" aria-hidden />
        {entry.label}
      </span>
      <Button asChild size="sm" className="h-9 gap-2 rounded-full px-4">
        <Link href={entry.href}>
          <LayoutDashboard className="size-4" aria-hidden />
          Dashboard
        </Link>
      </Button>
    </div>
  );
}

export function PublicNavbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  // Better Auth's client type does not know about the extra `role` column.
  const role = (session?.user as { role?: UserRole } | undefined)?.role;
  const entry = role ? (DASHBOARD_ENTRY[role] ?? DASHBOARD_ENTRY.PARTICIPANT) : null;
  const EntryIcon = entry?.icon;

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(pathname, link.href)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isPending ? (
          // Reserve the slot so the navbar does not jump when the session lands.
          <div className="hidden h-9 w-40 md:block" aria-hidden />
        ) : entry ? (
          <DashboardEntry entry={entry} />
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost">
              <Link href="/masuk">Masuk</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/daftar">Daftar</Link>
            </Button>
          </div>
        )}

        <button
          type="button"
          className="text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="bg-background border-t md:hidden">
          <nav
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6"
            aria-label="Navigasi seluler"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm",
                  isActive(pathname, link.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}

            {entry ? (
              <Button asChild className="mt-2 w-full justify-between rounded-lg">
                <Link href={entry.href} onClick={() => setOpen(false)}>
                  <span className="flex items-center gap-2">
                    {EntryIcon && <EntryIcon className="size-4" aria-hidden />}
                    Dashboard {entry.label}
                  </span>
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/masuk" onClick={() => setOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild className="flex-1 rounded-full">
                  <Link href="/daftar" onClick={() => setOpen(false)}>
                    Daftar
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
