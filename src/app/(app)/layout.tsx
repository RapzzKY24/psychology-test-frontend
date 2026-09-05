import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ParticipantBar } from "@/features/participant/components/participant-bar";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <ParticipantBar name={session.user.name} />
      {children}
    </div>
  );
}
