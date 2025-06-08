"use client";
import FiskeContent from "@/components/features/FiskeContent";
import JaktContent from "@/components/features/JaktContent";
import { useState } from "react";

export default function JaktFiskePage() {
  const [activeTab, setActiveTab] = useState<"fiske" | "jakt">("fiske");

  return (
    <div className="mt-4">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("fiske")}
          className={`px-4 py-2 rounded-t-md cursor-pointer ${
            activeTab === "fiske" ? "bg-forest text-white" : "bg-gray-200"
          }`}
        >
          Fiske
        </button>
        <button
          onClick={() => setActiveTab("jakt")}
          className={`px-4 py-2 rounded-t-md cursor-pointer ${
            activeTab === "jakt" ? "bg-orange text-white" : "bg-gray-200"
          }`}
        >
          Jakt
        </button>
      </div>

      <div className="p-4 border border-t-0 rounded-b-md bg-white shadow-md">
        {activeTab === "fiske" ? <FiskeContent /> : <JaktContent />}
      </div>
    </div>
  );
}
