"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Menu",
    items: [
      { href: "/instansi", label: "Ringkasan", icon: LayoutDashboard },
      { href: "/instansi/pegawai", label: "Pegawai", icon: Users },
      { href: "/instansi/sesi", label: "Sesi", icon: CalendarDays },
      { href: "/instansi/pembayaran", label: "Pembayaran", icon: Wallet },
      { href: "/instansi/buat-sesi", label: "Buat Sesi", icon: CalendarDays },
      { href: "/instansi/hasil", label: "Hasil", icon: FileText },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/instansi" ? pathname === "/instansi" : pathname.startsWith(href);
}

function BrandMark() {
  return (
    <div className="px-3 py-4">
      <Image
        src="/logo/logopsikologi.jpeg"
        alt="mypsikolog.id"
        width={173}
        height={50}
        priority
        className="h-8 w-auto"
      />
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          active
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      {item.label}
    </Link>
  );
}

function PublicSiteLink() {
  return (
    <div className="border-t pt-2">
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md">
          <Globe className="size-4" aria-hidden />
        </span>
        Website Publik
        <ExternalLink className="ml-auto size-3.5 opacity-60" aria-hidden />
      </Link>
    </div>
  );
}

function NavGroups({ pathname }: { pathname: string }) {
  return (
    <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </div>
        </div>
      ))}
      <PublicSiteLink />
    </nav>
  );
}

function SignOutRow() {
  const signOut = useSignOut();
  return (
    <button
      type="button"
      onClick={signOut}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <LogOut className="size-4" aria-hidden />
      Keluar
    </button>
  );
}

function UserBlock({ name, email }: { name: string; email: string }) {
  return (
    <div className="border-t p-3">
      <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-1.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-tight">{name}</p>
          <p className="truncate text-xs text-muted-foreground leading-tight">{email}</p>
        </div>
      </div>
      <SignOutRow />
    </div>
  );
}

export function InstansiSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-svh w-60 shrink-0 flex-col overflow-hidden border-r bg-sidebar md:flex">
      <BrandMark />
      <NavGroups pathname={pathname} />
      <UserBlock name={name} email={email} />
    </aside>
  );
}

export function InstansiMobileBar({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b bg-sidebar md:hidden">
      <BrandMark />
      <NavGroups pathname={pathname} />
      <div className="flex items-center justify-between border-t p-3">
        <p className="truncate px-2 text-xs text-muted-foreground">{name}</p>
      </div>
      <div className="px-3 pb-3">
        <SignOutRow />
      </div>
    </header>
  );
}
