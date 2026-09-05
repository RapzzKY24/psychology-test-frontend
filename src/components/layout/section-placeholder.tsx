import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionPlaceholderProps {
  title: string;
  description: string;
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <main className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
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
