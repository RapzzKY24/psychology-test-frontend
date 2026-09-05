import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MODULES = [
  { href: "/admin/users", title: "Pengguna", description: "Kelola akun dan role (ADMIN, PSYCHOLOGIST, PARTICIPANT)." },
  { href: "/admin/tes", title: "Tes", description: "Test Builder: soal, interpretasi, publish & archive." },
  { href: "/admin/institusi", title: "Institusi", description: "Data institusi klien B2B dan kontaknya." },
  { href: "/admin/sesi", title: "Sesi", description: "Sesi group, slot, PIN, dan tautan undangan." },
  { href: "/admin/pembayaran", title: "Pembayaran", description: "Verifikasi QRIS manual berdasarkan kode unik." },
  { href: "/admin/invoice", title: "Invoice", description: "Tagihan B2B: INV-YYYY-NNNN, status, jatuh tempo." },
  { href: "/admin/hasil", title: "Hasil", description: "Monitor hasil peserta dan resubmit hasil returned." },
] as const;

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
        {MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
