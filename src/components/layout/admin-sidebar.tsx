"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Building2,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ReceiptText,
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
      { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
      { href: "/admin/users", label: "Pengguna", icon: Users },
      { href: "/admin/tes", label: "Tes", icon: ClipboardList },
      { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
      { href: "/admin/institusi", label: "Institusi", icon: Building2 },
    ],
  },
  {
    label: "Operasional",
    items: [
      { href: "/admin/sesi", label: "Sesi", icon: CalendarDays },
      { href: "/admin/pembayaran", label: "Pembayaran", icon: Wallet },
      { href: "/admin/invoice", label: "Invoice", icon: ReceiptText },
      { href: "/admin/hasil", label: "Hasil", icon: ChartColumn },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Brain className="size-5" aria-hidden />
      </span>
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
          Psikotes
          <span aria-hidden className="size-1.5 rounded-full bg-chart-3" />
        </p>
        <p className="text-xs text-muted-foreground leading-tight">Konsol Admin</p>
      </div>
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
          active ? "bg-primary/15 text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      {item.label}
    </Link>
  );
}

function NavGroups({ pathname }: { pathname: string }) {
  return (
    <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-2">
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

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
      <BrandMark />
      <NavGroups pathname={pathname} />
      <UserBlock name={name} email={email} />
    </aside>
  );
}

export function AdminMobileBar({ name }: { name: string }) {
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
