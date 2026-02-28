export function buildQuery<T extends object>(params?: T): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([_, v]) => v !== undefined);
  if (entries.length === 0) return "";
  const parts: string[] = [];
  for (const [k, v] of entries) {
    if (Array.isArray(v)) {
      // Arrays → repeated query params: ?names=foo&names=bar
      for (const item of v) {
        parts.push(
          `${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`,
        );
      }
    } else if (typeof v === "object" && v !== null) {
      // Objects (e.g. filters) → JSON-encoded
      parts.push(
        `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(v))}`,
      );
    } else {
      parts.push(
        `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      );
    }
  }

  return parts.length > 0 ? `?${parts.join("&")}` : "";
}
