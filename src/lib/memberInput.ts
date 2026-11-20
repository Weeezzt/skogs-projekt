// Validates the JSON body for creating/updating a board member
export function parseMemberInput(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data = {
    name: str(b.name),
    role: str(b.role),
    address: str(b.address),
    phone: str(b.phone),
    email: str(b.email),
  };
  if (!data.name || !data.role) return null;
  return data;
}
