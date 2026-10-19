"use client";
import FiskeContent from "@/components/features/FiskeContent";
import JaktContent from "@/components/features/JaktContent";
import { useState } from "react";

export default function JaktFiskePage() {
  const [activeTab, setActiveTab] = useState<"fiske" | "jakt">("jakt");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 mt-4">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("fiske")}
          aria-pressed={activeTab === "fiske"}
          className={`px-4 py-2 rounded-md cursor-pointer font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
            activeTab === "fiske"
              ? "bg-orange text-forest"
              : "bg-forest-dark text-beige hover:text-orange"
          }`}
        >
          Fiske
        </button>
        <button
          onClick={() => setActiveTab("jakt")}
          aria-pressed={activeTab === "jakt"}
          className={`px-4 py-2 rounded-md cursor-pointer font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
            activeTab === "jakt"
              ? "bg-orange text-forest"
              : "bg-forest-dark text-beige hover:text-orange"
          }`}
        >
          Jakt
        </button>
      </div>

      <div className="">
        {activeTab === "fiske" ? <FiskeContent /> : <JaktContent />}
      </div>
    </div>
  );
}
