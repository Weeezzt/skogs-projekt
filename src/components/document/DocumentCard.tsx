import { DocumentDTO } from "@/types/dtos";
import FileTypeIcon from "./FileTypeIcon";
import { useState } from "react";
import { IoMdDownload } from "react-icons/io";
import TooltipZone from "../TooltipZone";

interface DocumentCardProps {
  documentData: DocumentDTO;
  variant?: "grid" | "list";
}

export default function DocumentCard({
  documentData,
  variant = "grid",
}: DocumentCardProps) {
  const { title, fileType, path, category, year, tags, description, preview } =
    documentData;

  const fileUrl = `/docs/${path}`;
  const [numPages, setNumPages] = useState<number | null>(null);

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default anchor navigation if inside <a>

    const link = document.createElement("a");
    link.href = fileUrl; // URL to the file
    link.download = path; // Suggested filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`group transition rounded-xl border bg-beige ${
        variant === "grid"
          ? "flex flex-col items-center p-4 gap-2 h-64 w-full"
          : "flex flex-row items-center p-4 gap-4 w-full"
      }`}
      title={title}
    >
      <div
        className={`flex-shrink-0 ${
          variant === "grid" ? "" : "mr-4"
        } w-20 h-24 overflow-hidden`}
      >
        <FileTypeIcon fileType={fileType} />
      </div>

      <div
        className={`w-full flex-1 ${variant === "grid" ? "text-center" : ""}`}
      >
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <TooltipZone tooltip={description ? description : ""}>
            <div className="font-semibold text-lg hover:text-orange truncate">
              {title}
            </div>
          </TooltipZone>
        </a>
        <div className="text-xs text-gray-500 mb-1">
          {category}
          {year && ` • ${year}`}
        </div>
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-orange/10 text-orange px-2 py-0.5 rounded text-xs"
              >
                {tag ? tag : "dokument"}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            <span className="bg-orange/10 text-orange px-2 py-0.5 rounded text-xs">
              Ingen tagg
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-400">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center text-center bg-beige text-md font-semibold text-orange w-30 h-10 p-2 rounded-md border-2 border-orange cursor-pointer hover:border-beige hover:bg-orange hover:text-beige transition-colors"
        >
          Ladda ned <IoMdDownload className="text-xl" />
        </button>
      </div>
    </div>
  );
}
