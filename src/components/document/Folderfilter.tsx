import { DocumentDTO } from "@/types/dtos";
import { useState, useMemo } from "react";
import { FaRegFolder } from "react-icons/fa6";

interface FolderFilterProps {
  documents: DocumentDTO[];
  activeCategories: string[] | null;
  onCategoriesChange: (category: string[] | null) => void;
}

export default function FolderFilter({
  documents,
  activeCategories,
  onCategoriesChange,
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
    if (activeCategories?.includes(category)) {
      // Remove category from activeCategories
      const newCategories = activeCategories.filter((cat) => cat !== category);
      onCategoriesChange(newCategories.length > 0 ? newCategories : null);
    } else {
      // Add category to activeCategories
      const newCategories = activeCategories
        ? [...activeCategories, category]
        : [category];
      onCategoriesChange(newCategories);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => handleClick(cat.name)}
          className={`px-4 pt-2 pb-1 rounded-md border-2 text-sm transition duration-200 cursor-pointer
            ${
              activeCategories?.includes(cat.name)
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
