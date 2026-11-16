import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ParticipantMobileBar,
  ParticipantSidebar,
} from "@/features/participant/components/participant-sidebar";
import { getServerSession } from "@/lib/api/server";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Psikotes" },
};

/**
 * Same chrome as the admin, psychologist, and institution consoles — a rail on
 * desktop, the same stack on small screens — so only the menu differs.
 */
export default async function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col md:pl-60">
      <ParticipantMobileBar name={session.user.name} />
      <ParticipantSidebar name={session.user.name} email={session.user.email} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
