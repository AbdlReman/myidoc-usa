export type MergeTagData = {
  first_name: string;
  email: string;
  booking_link: string;
  unsubscribe_link: string;
  site_url: string;
};

const TAG_PATTERN = /\{\{\s*([a-zA-Z_]+)\s*(?:\|([^}]*))?\}\}/g;

/** Replaces {{tag}} / {{tag|fallback}} placeholders with values from `data`. */
export function renderMergeTags(input: string, data: Partial<MergeTagData>): string {
  return input.replace(TAG_PATTERN, (match, tag: string, fallback?: string) => {
    const value = data[tag as keyof MergeTagData];
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value);
    return fallback !== undefined ? fallback : match;
  });
}
