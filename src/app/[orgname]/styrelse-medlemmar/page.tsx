"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProfileCard from "@/features/cards/ProfileCard";

type Member = {
  id: number;
  name: string;
  role: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  imageUrl?: string | null;
};

export default function StyrelseMedlemmarPage() {
  const params = useParams() as { orgname?: string };
  const routeOrg = (params.orgname || "sorsele").toLowerCase();

  // Map route -> DB slug (so /sorsele hits org.slug "sorsele-skog")
  const orgSlug = useMemo(
    () => (routeOrg === "sorsele" ? "sorsele" : routeOrg),
    [routeOrg]
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/${orgSlug}/members`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta medlemmar");
        return res.json();
      })
      .then((data: Member[]) => {
        if (!cancelled) setMembers(data);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [orgSlug]);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-beige mb-8 text-center">
        Styrelse & Medlemmar
      </h1>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-forest/20 bg-beige p-4 shadow-sm animate-pulse"
            >
              <div className="h-20 w-20 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-8 w-32 bg-gray-200 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {members.map((m) => (
            <ProfileCard
              key={m.id ?? `${m.name}-${m.role}`}
              name={m.name}
              role={m.role}
              address={m.address || ""}
              phone={m.phone || ""}
              email={m.email || ""}
            />
          ))}
        </div>
      )}
    </main>
  );
}
