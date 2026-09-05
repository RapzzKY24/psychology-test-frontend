interface PageHeaderProps {
  title: string;
  description?: string;
}

/**
 * Page title with the client-approved gold accent (chart-3 token). The gold
 * is a decorative bar — never text color — so contrast stays AA in light mode.
 */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden className="mt-1.5 h-5 w-1 shrink-0 rounded-full bg-chart-3" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
