import { TechnicalTable } from "@/lib/types";

export function DataTable({ rows }: { rows: TechnicalTable[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Diameter</th>
            <th className="px-4 py-3">Thickness</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.size}-${index}`} className="border-b border-slate-100">
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
