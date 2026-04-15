import { Specification } from "@/lib/types";

export function SpecTable({ specs }: { specs: Specification[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((item) => (
            <tr key={`${item.key}-${item.value}`} className="border-b border-slate-100">
              <td className="w-48 bg-slate-50 px-4 py-3 font-medium text-slate-700">{item.key}</td>
              <td className="px-4 py-3 text-slate-600">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
