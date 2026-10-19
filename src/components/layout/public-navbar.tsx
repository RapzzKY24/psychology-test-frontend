"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/tes", label: "Tes" },
  { href: "/artikel", label: "Artikel" },
  { href: "/untuk-perusahaan", label: "Untuk Perusahaan" },
] as const;

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

export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 shadow-sm backdrop-blur">
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
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/masuk">Masuk</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/daftar">Daftar</Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Navigasi seluler">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm",
                  isActive(pathname, link.href)
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
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
          </nav>
        </div>
      )}
    </header>
  );
}
