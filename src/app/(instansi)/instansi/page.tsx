import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dasbor Instansi" };

/** Minimal landing — full dashboard (pegawai, sesi, monitor) is a follow-up issue. */
export default function InstansiPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dasbor Instansi</CardTitle>
        <CardDescription>
          Kelola pegawai, buat sesi tes, dan pantau hasil — segera hadir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/">Kembali ke beranda</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
