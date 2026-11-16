import { ParticipantTabs } from "@/features/participant/components/participant-tabs";

/**
 * The five participant tabs share this layout. /hasil and the runner sit
 * outside it on purpose: they are not tabs.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticipantTabs />
      {children}
    </>
  );
}
