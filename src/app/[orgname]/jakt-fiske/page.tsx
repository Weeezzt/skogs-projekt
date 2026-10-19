"use client";
import FiskeContent from "@/components/features/FiskeContent";
import JaktContent from "@/components/features/JaktContent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TABS = [
  { key: "fiske", label: "Fiske" },
  { key: "jakt", label: "Jakt" },
] as const;

export default function JaktFiskePage() {
  // ?flik=fiske makes the tab linkable; jakt is the default
  const activeTab = useSearchParams().get("flik") === "fiske" ? "fiske" : "jakt";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 mt-4">
      <div className="flex justify-center gap-2 mb-4">
        {TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={`?flik=${key}`}
            replace
            scroll={false}
            aria-current={activeTab === key ? "page" : undefined}
            className={`px-4 py-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
              activeTab === key
                ? "bg-orange text-forest"
                : "bg-forest-dark text-beige hover:text-orange"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {activeTab === "fiske" ? <FiskeContent /> : <JaktContent />}
    </div>
  );
}
