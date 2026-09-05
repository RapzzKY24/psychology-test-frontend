"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/tes", label: "Tes" },
  { href: "/admin/institusi", label: "Institusi" },
  { href: "/admin/sesi", label: "Sesi" },
  { href: "/admin/pembayaran", label: "Pembayaran" },
  { href: "/admin/invoice", label: "Invoice" },
  { href: "/admin/hasil", label: "Hasil" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="border-b px-4 py-4">
        <p className="text-sm font-semibold">Psikotes</p>
        <p className="text-xs text-muted-foreground">Konsol Admin</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm",
              isActive(pathname, item.href)
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
        <SignOutButton className="mt-2 w-full" variant="outline" size="sm" />
      </div>
    </aside>
  );
}

export function AdminMobileBar({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b bg-sidebar md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">Psikotes Admin</p>
        <div className="flex items-center gap-2">
          <span className="max-w-32 truncate text-xs text-muted-foreground">{name}</span>
          <SignOutButton variant="outline" size="sm" />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm",
              isActive(pathname, item.href)
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
