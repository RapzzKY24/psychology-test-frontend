import type { HelpDeliverableColumn, HelpDeliverableRow } from "../help-content";

interface ComparisonTableProps {
  columns: readonly HelpDeliverableColumn[];
  rows: readonly HelpDeliverableRow[];
}

/**
 * Personal vs institution comparison. Desktop gets a table; narrow screens get
 * one card per row so the values do not turn into a sideways scroll.
 */
export function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border xl:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="p-4 font-medium">
                Aspek
              </th>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="p-4 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="p-4 text-left font-medium">
                  {row.label}
                </th>
                {columns.map((column) => (
                  <td key={column.key} className="text-muted-foreground p-4 leading-relaxed">
                    {row.values[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 xl:hidden">
        {rows.map((row) => (
          <div key={row.label} className="bg-card rounded-2xl border p-4">
            <p className="font-semibold">{row.label}</p>
            <dl className="mt-2 grid gap-2">
              {columns.map((column) => (
                <div key={column.key} className="grid grid-cols-[92px_1fr] gap-2 text-sm">
                  <dt className="text-muted-foreground">{column.label}</dt>
                  <dd className="break-words leading-relaxed">{row.values[column.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
