import { DocumentDTO } from "@/types/dtos";
import FileTypeIcon from "./FileTypeIcon";
import { useState } from "react";
import { IoMdDownload, IoMdTrash } from "react-icons/io";
import TooltipZone from "../TooltipZone";
import { useUserSession } from "@/hooks/useUserSession";
import { useParams } from "next/navigation";

interface DocumentCardProps {
  documentData: DocumentDTO;
  variant?: "grid" | "list";
  isSpecial?: boolean;
}

export default function DocumentCard({
  documentData,
  variant = "grid",
  isSpecial = false,
}: DocumentCardProps) {
  const { id, title, fileType, path, category, year, tags, description } =
    documentData;
  const { isLoggedIn, user } = useUserSession();
  const fileUrl = path;
  const organisation = useParams().orgname?.toString();

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = title || fileUrl.split("/").pop() || "dokument";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (window.confirm("Är du säker på att du vill ta bort dokumentet?")) {
      await fetch(`/api/${organisation}/document/${id}`, {
        method: "PATCH",
      });
      window.location.reload();
    }
  };

  return (
    <div
      className={`group transition rounded-md border border-beige/30 bg-forest-dark text-beige/90 ${
        variant === "grid"
          ? "flex flex-col items-center p-4 gap-2 h-64 w-full"
          : "flex flex-row items-center p-4 gap-4 w-full"
      }`}
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
        <TooltipZone
          position="bottom"
          variant="light"
          tooltip={description ? description : title + " - " + fileType}
        >
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div
              className={`font-semibold text-lg hover:text-orange truncate w-full max-w-[220px] mx-auto whitespace-nowrap overflow-hidden`}
            >
              {title}
            </div>
          </a>
        </TooltipZone>

        <div className={`text-xs text-beige/70 mb-1`}>
          {category}
          {year && ` • ${year}`}
        </div>
      </div>

      {isLoggedIn && user ? (
        <div className="mt-2 text-xs flex gap-2 text-beige/70">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center text-center bg-beige text-md font-semibold text-orange w-30 h-10 p-2 rounded-md border-2 border-orange cursor-pointer hover:border-beige hover:bg-orange hover:text-beige transition-colors"
          >
            Ladda ned <IoMdDownload className="text-xl" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center text-center bg-beige text-md font-semibold text-red-600 w-30 h-10 p-2 rounded-md border-2 border-red-600 cursor-pointer hover:border-beige hover:bg-red-600 hover:text-beige transition-colors"
          >
            Ta bort <IoMdTrash className="text-xl" />
          </button>
        </div>
      ) : (
        <div className="mt-2 text-xs text-beige/70">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center text-center text-md font-semibold text-orange/80 w-30 h-10 p-2 rounded-md cursor-pointer hover:border-beige hover:bg-forest  transition-colors"
          >
            Ladda ned <IoMdDownload className="ml-2 text-xl" />
          </button>
        </div>
      )}
    </div>
  );
}
