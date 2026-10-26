// Path of the latest uploaded document with this tag, or null to keep the fallback
export async function fetchDocumentPath(
  org: string,
  tag: string
): Promise<string | null> {
  try {
    const res = await fetch(`/api/${org}/document/tag/${tag}`);
    if (!res.ok) return null;
    const doc = await res.json();
    return doc?.path ?? null;
  } catch {
    return null;
  }
}
