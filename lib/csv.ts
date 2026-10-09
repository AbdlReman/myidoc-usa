/** Builds a CSV string from an array of flat objects (quotes/escapes values as needed). */
export function toCsv(rows: Record<string, string>[], columns?: string[]): string {
  if (rows.length === 0) return "";
  const cols = columns || Object.keys(rows[0]);

  const escape = (value: string) => {
    const str = value ?? "";
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [cols.map(escape).join(",")];
  for (const row of rows) {
    lines.push(cols.map((col) => escape(row[col] ?? "")).join(","));
  }
  return lines.join("\n");
}
