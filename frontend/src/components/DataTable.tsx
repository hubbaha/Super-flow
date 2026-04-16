import { TechnicalTable } from "@/lib/types";

export function DataTable({ rows }: { rows: TechnicalTable[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Diameter</th>
            <th className="px-4 py-3">Thickness</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.size}-${index}`} className="border-b border-slate-100 transition hover:bg-slate-50">
              <td className="px-4 py-3">{row.size}</td>
              <td className="px-4 py-3">{row.diameter}</td>
              <td className="px-4 py-3">{row.thickness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
