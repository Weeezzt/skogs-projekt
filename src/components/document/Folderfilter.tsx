import { DocumentDTO } from "@/types/dtos";
import { useState, useMemo } from "react";
import { FaRegFolder } from "react-icons/fa6";

interface FolderFilterProps {
  documents: DocumentDTO[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function FolderFilter({
  documents,
  activeCategory,
  onCategoryChange,
}: FolderFilterProps) {
  // Extract unique categories and counts
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    documents.forEach((doc) => {
      map.set(doc.category, (map.get(doc.category) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [documents]);

  const handleClick = (category: string) => {
    onCategoryChange(activeCategory === category ? null : category);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => handleClick(cat.name)}
          className={`px-4 pt-2 pb-1 rounded-md border-2 text-sm transition duration-200 cursor-pointer
            ${
              activeCategory === cat.name
                ? "bg-beige text-orange font-semibold border-orange"
                : "bg-beige text-forest border-forest font-semibold hover:border-orange "
            }`}
        >
          <FaRegFolder className="inline-block mr-2 text-xl mb-1" />
          {cat.name} ({cat.count})
        </button>
      ))}
    </div>
  );
}
