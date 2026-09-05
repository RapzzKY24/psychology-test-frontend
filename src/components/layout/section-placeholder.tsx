import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionPlaceholderProps {
  title: string;
  description: string;
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader title={title} description={description} />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Segera hadir</CardTitle>
          <CardDescription>
            Modul ini sedang dibangun pada batch berikutnya. Navigasi di sebelah kiri sudah aktif.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </main>
  );
}
