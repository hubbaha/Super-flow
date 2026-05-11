import { getTechnicalTableColumnLabel } from "@/lib/table-display";

type DataRow = Record<string, string | number | null | undefined>;
type TableEntity = { data: DataRow | null };
type Props = {
  rows: TableEntity[] | DataRow[];
  /** Per-column header overrides (from product admin). */
  columnLabels?: Record<string, string> | null;
};

export function DataTable({ rows, columnLabels }: Props) {
  const normalizedRows = rows
    .map((row) => ("data" in row ? row.data : row))
    .filter((row): row is DataRow => Boolean(row) && typeof row === "object");

  if (normalizedRows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        No size table data available.
      </div>
    );
  }

  const columns = Object.keys(normalizedRows[0]).filter(
    (key) => key !== "id" && key !== "productId",
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold">
                {getTechnicalTableColumnLabel(col, columnLabels)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {normalizedRows.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col}
                  className={`px-4 py-3 ${
                    colIndex === 0
                      ? "font-medium text-slate-900"
                      : "text-slate-600"
                  }`}
                >
                  {row[col] == null || row[col] === "" ? "—" : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
