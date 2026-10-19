// Path of the latest uploaded rules PDF, or null to keep the fallback
export async function fetchRulesPath(
  org: string,
  type: "jakt-regler" | "fiske-regler"
): Promise<string | null> {
  try {
    const res = await fetch(`/api/${org}/document/${type}`);
    if (!res.ok) return null;
    const doc = await res.json();
    return doc?.path ?? null;
  } catch {
    return null;
  }
}
