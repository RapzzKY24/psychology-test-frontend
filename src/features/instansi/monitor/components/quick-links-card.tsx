import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickLink {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const QUICK_LINKS: QuickLink[] = [
  { href: "/instansi/pegawai", title: "Kelola Pegawai", description: "Tambah dan kelola data pegawai.", icon: Users },
  { href: "/instansi/buat-sesi", title: "Buat Sesi", description: "Pilih tes dan peserta, bagikan tautan.", icon: CalendarDays },
];

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Aksi cepat</CardTitle>
        <CardDescription>Mulai dari sini.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Button
              key={link.href}
              variant="outline"
              className="h-auto justify-start gap-3 p-4"
              asChild
            >
              <Link href={link.href}>
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-left">
                  <span className="block text-sm font-medium">{link.title}</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {link.description}
                  </span>
                </span>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
