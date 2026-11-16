"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Globe, LogOut } from "lucide-react";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { cn } from "@/lib/utils";

export interface ConsoleNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface ConsoleNavGroup {
  label: string;
  items: ConsoleNavItem[];
}

export interface ConsoleConfig {
  /** The console's landing route; only this one needs an exact match. */
  root: string;
  /** Caption under the logo. Omitted on consoles that need none. */
  caption?: string;
  groups: ConsoleNavGroup[];
}

/** Root matches exactly, children match their own subtree. */
export function isConsoleNavActive(
  pathname: string,
  href: string,
  root: string,
): boolean {
  if (href === root) return pathname === root;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark({ caption }: { caption?: string }) {
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
      {caption && (
        <p className="text-muted-foreground mt-2 text-xs leading-tight">{caption}</p>
      )}
    </div>
  );
}

function NavLink({ item, active }: { item: ConsoleNavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
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
        className="group text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
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

function NavGroups({
  config,
  pathname,
}: {
  config: ConsoleConfig;
  pathname: string;
}) {
  return (
    <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-2">
      {config.groups.map((group) => (
        <div key={group.label}>
          <p className="text-muted-foreground px-3 pt-2 pb-1.5 text-xs font-medium tracking-wider uppercase">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isConsoleNavActive(pathname, item.href, config.root)}
              />
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
      className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
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
        <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm leading-tight font-medium">{name}</p>
          <p className="text-muted-foreground truncate text-xs leading-tight">{email}</p>
        </div>
      </div>
      <SignOutRow />
    </div>
  );
}

/**
 * The console chrome every signed-in role shares: a fixed rail on desktop and
 * the same stack inline on small screens. A console supplies its menu and the
 * landing route, nothing else — so the four dashboards cannot drift apart.
 */
export function ConsoleSidebar({
  config,
  name,
  email,
}: {
  config: ConsoleConfig;
  name: string;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r md:flex">
      <BrandMark caption={config.caption} />
      <NavGroups config={config} pathname={pathname} />
      <UserBlock name={name} email={email} />
    </aside>
  );
}

export function ConsoleMobileBar({
  config,
  name,
}: {
  config: ConsoleConfig;
  name: string;
}) {
  const pathname = usePathname();

  return (
    <header className="bg-sidebar border-b md:hidden">
      <BrandMark caption={config.caption} />
      <NavGroups config={config} pathname={pathname} />
      <div className="flex items-center justify-between border-t p-3">
        <p className="text-muted-foreground truncate px-2 text-xs">{name}</p>
      </div>
      <div className="px-3 pb-3">
        <SignOutRow />
      </div>
    </header>
  );
}
