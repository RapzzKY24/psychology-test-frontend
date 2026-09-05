import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  ReceiptText,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminModule {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const MODULES: AdminModule[] = [
  { href: "/admin/users", title: "Pengguna", description: "Kelola akun dan role (ADMIN, PSYCHOLOGIST, PARTICIPANT).", icon: Users },
  { href: "/admin/tes", title: "Tes", description: "Test Builder: soal, interpretasi, publish & archive.", icon: ClipboardList },
  { href: "/admin/institusi", title: "Institusi", description: "Data institusi klien B2B dan kontaknya.", icon: Building2 },
  { href: "/admin/sesi", title: "Sesi", description: "Sesi group, slot, PIN, dan tautan undangan.", icon: CalendarDays },
  { href: "/admin/pembayaran", title: "Pembayaran", description: "Verifikasi QRIS manual berdasarkan kode unik.", icon: Wallet },
  { href: "/admin/invoice", title: "Invoice", description: "Tagihan B2B: nomor, status, jatuh tempo.", icon: ReceiptText },
  { href: "/admin/hasil", title: "Hasil", description: "Monitor hasil peserta dan resubmit hasil returned.", icon: ChartColumn },
];

export default function AdminHomePage() {
  return (
    <main className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ringkasan</h1>
        <p className="text-sm text-muted-foreground">
          Pusat kendali platform: kelola tes, sesi, pembayaran, dan hasil.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.href} href={mod.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle className="text-base">{mod.title}</CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
