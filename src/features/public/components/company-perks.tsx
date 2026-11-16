import { Building2, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PERKS = [
  {
    icon: Users,
    title: "Pemetaan tim",
    body: "Kepribadian, gaya kerja, dan minat tiap karyawan dalam satu sesi terjadwal.",
  },
  {
    icon: ShieldCheck,
    title: "Hasil terlulusi",
    body: "Laporan psikolog resmi + verifikasi QR, cocok untuk kebutuhan HR & compliance.",
  },
  {
    icon: Building2,
    title: "Kuota peserta",
    body: "Sediakan kuota peserta instansi, lalu daftarkan kapan saja.",
  },
];

/** What an institution gets, as three cards under the hero. */
export function CompanyPerks() {
  return (
    <section className="grid gap-5 sm:grid-cols-3">
      {PERKS.map((perk) => (
        <Card key={perk.title} className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <perk.icon className="size-5" aria-hidden />
            </span>
            <h2 className="font-semibold">{perk.title}</h2>
            <p className="text-sm text-muted-foreground">{perk.body}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
