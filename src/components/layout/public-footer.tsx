import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Layanan",
    links: [
      { href: "/tes", label: "Tes Psikologi" },
      { href: "/artikel", label: "Artikel" },
      { href: "/untuk-perusahaan", label: "Untuk Perusahaan" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { href: "/untuk-perusahaan", label: "Paket Instansi" },
      { href: "/masuk", label: "Masuk" },
      { href: "/daftar", label: "Daftar" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { href: "/artikel", label: "Panduan & FAQ" },
      { href: "/untuk-perusahaan", label: "Hubungi Kami" },
    ],
  },
] as const;

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Image
            src="/logo/logopsikologi.jpeg"
            alt="Psikotes"
            width={173}
            height={50}
            className="h-9 w-auto"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            Platform tes psikologi: pengerjaan online dan hasil yang terverifikasi.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Psikotes. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
