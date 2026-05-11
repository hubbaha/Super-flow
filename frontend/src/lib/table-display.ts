const DEFAULT_TECHNICAL_TABLE_COLUMN_LABELS: Record<string, string> = {
  size: "Size",
  diameter: "Diameter",
  thickness: "Thickness",
  od_mm: "OD (mm)",
  weight_kg: "Weight (kg)",
  pressure: "Pressure",
  length: "Length",
  id_mm: "ID (mm)",
};

function humanizeColumnKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getTechnicalTableColumnLabel(
  key: string,
  overrides?: Record<string, string> | null,
): string {
  const custom = overrides?.[key]?.trim();
  if (custom) return custom;
  return DEFAULT_TECHNICAL_TABLE_COLUMN_LABELS[key] ?? humanizeColumnKey(key);
}

export const PREFERRED_TABLE_COLUMN_KEY_ORDER: string[] = [
  "size",
  "diameter",
  "od_mm",
  "id_mm",
  "thickness",
  "weight_kg",
  "pressure",
  "length",
];

export function orderTechnicalTableColumnKeys(keys: Iterable<string>): string[] {
  const set = new Set(keys);
  const preferred = PREFERRED_TABLE_COLUMN_KEY_ORDER.filter((k) => set.has(k));
  const rest = [...set].filter((k) => !preferred.includes(k)).sort();
  return [...preferred, ...rest];
}
