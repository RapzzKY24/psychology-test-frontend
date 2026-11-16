import { PageHeader } from "@/components/layout/page-header";

interface ParticipantPlaceholderProps {
  title: string;
  description: string;
}

/**
 * Temporary body for a tab whose content is not built yet. It never claims the
 * list is empty — that would read as "you have nothing" instead of "not ready".
 */
export function ParticipantPlaceholder({ title, description }: ParticipantPlaceholderProps) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 p-6">
      <PageHeader title={title} description={description} />
      <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Tab ini sedang disiapkan.
      </p>
    </main>
  );
}
