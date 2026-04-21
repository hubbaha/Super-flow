import { TechnicalTable } from "@/lib/types";

const COLUMN_LABELS: Record<string, string> = {
  size: "Size",
  diameter: "Diameter",
  thickness: "Thickness",
  od_mm: "OD (mm)",
  weight_kg: "Weight (kg)",
  pressure: "Pressure",
  length: "Length",
  id_mm: "ID (mm)",
};

export function DataTable({ rows }: { rows: TechnicalTable[] }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        No size table data available.
      </div>
    );
  }

  // Auto-detect columns, excluding internal fields
  const columns = Object.keys(rows[0]).filter(
    (key) => key !== "id" && key !== "productId"
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold">
                {COLUMN_LABELS[col] ?? col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
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
                  {row[col] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}