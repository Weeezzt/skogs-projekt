"use client";
import { useState } from "react";

interface Section {
  title: string;
  id: string;
  tags?: string[];
  content?: string;
}

export default function PageSearch({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const filtered = q
    ? sections.filter(
        (section) =>
          section.title.toLowerCase().includes(q) ||
          section.content?.toLowerCase().includes(q) ||
          section.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
    : [];

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setQuery(""); // Close dropdown after click
    }
  };

  return (
    <div className="relative w-full px-2 max-w-md ">
      <input
        type="text"
        placeholder="Sök på denna sida..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className=" text-beige placeholder-beige/80 border-2 border-beige/80 rounded-md w-full px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
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
