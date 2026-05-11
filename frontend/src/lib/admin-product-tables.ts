export type AdminTableInputRow = {
  data?: Record<string, unknown>;
  size?: string;
  od_mm?: string;
  weight_kg?: string;
  diameter?: string;
};

function stringish(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return String(v).trim();
}

export type TechnicalTableCreateRow = {
  size: string;
  od_mm: string;
  weight_kg: string;
  data: Record<string, string>;
};

export function adminTableInputToCreateRows(
  tables: AdminTableInputRow[],
): TechnicalTableCreateRow[] {
  return tables
    .map((t) => {
      let data: Record<string, string>;
      if (t.data && typeof t.data === "object" && !Array.isArray(t.data)) {
        data = Object.fromEntries(
          Object.entries(t.data as Record<string, unknown>).map(([k, v]) => [k, stringish(v)]),
        );
      } else {
        data = {
          size: stringish(t.size),
          od_mm: stringish(t.od_mm ?? t.diameter),
          weight_kg: stringish(t.weight_kg),
        };
      }
      return {
        size: data.size ?? "",
        od_mm: data.od_mm ?? data.diameter ?? "",
        weight_kg: data.weight_kg ?? "",
        data,
      };
    })
    .filter((row) => Object.values(row.data).some((cell) => cell.length > 0));
}
