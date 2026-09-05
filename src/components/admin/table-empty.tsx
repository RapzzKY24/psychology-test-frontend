interface TableEmptyProps {
  title: string;
  description?: string;
  filtered?: boolean;
}

export function TableEmpty({ title, description, filtered }: TableEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {(filtered || description) && (
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered ? "Tidak ada data yang cocok dengan filter ini." : description}
        </p>
      )}
    </div>
  );
}
