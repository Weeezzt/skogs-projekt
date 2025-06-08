"use client";
import { useState, useEffect } from "react";

interface Section {
  title: string;
  id: string;
  tags?: string[];
  content?: string;
}

export default function PageSearch({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Section[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const matches = sections.filter(
        (section) =>
          section.title.toLowerCase().includes(query.toLowerCase()) ||
          (section.content &&
            section.content.toLowerCase().includes(query.toLowerCase())) ||
          (section.tags &&
            section.tags.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            ))
      );
      setFiltered(matches);
    } else {
      setFiltered([]);
    }
  }, [query, sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setQuery(""); // Close dropdown after click
    }
  };

  return (
    <div className="relative w-full max-w-md ">
      <input
        type="text"
        placeholder="Sök på denna sida..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-black border-2 rounded-md w-full px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
      />
      {filtered.length > 0 && (
        <ul className="absolute bg-white w-full mt-1 border rounded shadow z-10">
          {filtered.map((section) => (
            <li
              key={section.id}
              onClick={() => handleClick(section.id)}
              className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              {section.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
