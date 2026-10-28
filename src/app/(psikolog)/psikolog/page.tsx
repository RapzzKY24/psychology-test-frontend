import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardCheck, TriangleAlert, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMyProfile, fetchReviewQueueCount } from "@/features/psikolog/monitor/api";

export const metadata: Metadata = { title: "Ringkasan" };

export default async function PsikologPage() {
  const [queueCount, profile] = await Promise.all([
    fetchReviewQueueCount(),
    fetchMyProfile(),
  ]);

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Ringkasan"
        description="Antrean review dan kelengkapan profil Anda."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antrean review</CardTitle>
            <ClipboardCheck className="size-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{queueCount}</p>
            <p className="text-xs text-muted-foreground">hasil menunggu peninjauan</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href="/psikolog/review">Buka antrean</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profil & TTD</CardTitle>
            <UserRound className="size-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            {profile.complete ? (
              <>
                <p className="text-2xl font-bold">Lengkap</p>
                <p className="text-xs text-muted-foreground">siap menyetujui hasil</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1.5 text-2xl font-bold">
                  <TriangleAlert className="size-5 text-amber-500" aria-hidden />
                  Belum lengkap
                </p>
                <p className="text-xs text-muted-foreground">
                  persetujuan diblokir sampai profil + tanda tangan lengkap
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/psikolog/profil">Lengkapi profil</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
