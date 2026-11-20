"use client";
import { useState } from "react";

export type MemberFields = {
  id?: number;
  name: string;
  role: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

interface MemberModalProps {
  org: string;
  member: MemberFields | null; // null = add new
  onClose: () => void;
  onSaved: () => void;
}

const ROLES = [
  "Ordförande",
  "Vice ordförande",
  "Kassör",
  "Allmänningsförvaltare",
  "Ledamot",
  "Suppleant",
];

const FIELDS = [
  { key: "name", label: "Namn", required: true },
  { key: "role", label: "Roll", required: true },
  { key: "address", label: "Adress" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-post" },
] as const;

export default function MemberModal({
  org,
  member,
  onClose,
  onSaved,
}: MemberModalProps) {
  const [form, setForm] = useState({
    name: member?.name ?? "",
    role: member?.role ?? "Ledamot",
    address: member?.address ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = member?.id
    ? `/api/${org}/members/${member.id}`
    : `/api/${org}/members`;

  const send = async (method: string, body?: object) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error();
      onSaved();
      onClose();
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(member?.id ? "PUT" : "POST", form);
        }}
        className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold text-forest mb-4">
          {member?.id ? "Redigera medlem" : "Lägg till medlem"}
        </h2>

        {FIELDS.map((f) => (
          <label key={f.key} className="block mb-3 text-sm text-forest">
            {f.label}
            <input
              required={"required" in f}
              list={f.key === "role" ? "member-roles" : undefined}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-forest"
            />
          </label>
        ))}
        <datalist id="member-roles">
          {ROLES.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex flex-wrap justify-end gap-2 mt-4">
          {member?.id && (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                confirmDelete ? send("DELETE") : setConfirmDelete(true)
              }
              className="mr-auto px-4 py-2 rounded text-sm text-red-700 hover:bg-red-50 cursor-pointer"
            >
              {confirmDelete ? "Bekräfta borttagning" : "Ta bort"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange text-forest font-semibold rounded hover:opacity-90 text-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sparar..." : "Spara"}
          </button>
        </div>
      </form>
    </div>
  );
}
