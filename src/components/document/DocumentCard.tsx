import { DocumentDTO } from "@/types/dtos";
import FileTypeIcon from "./FileTypeIcon";
import { IoMdDownload, IoMdTrash } from "react-icons/io";
import TooltipZone from "../TooltipZone";
import { buttonRow, dangerGhostButton, ghostButton } from "@/lib/buttonStyles";
import { useUserSession } from "@/hooks/useUserSession";
import { useParams } from "next/navigation";

interface DocumentCardProps {
  documentData: DocumentDTO;
  variant?: "grid" | "list";
}

export default function DocumentCard({
  documentData,
  variant = "grid",
}: DocumentCardProps) {
  const { id, title, fileType, path, category, year, description } =
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
      className={`group transition rounded-md border border-beige/10 bg-forest-dark text-beige/90 ${
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

      <div className={`mt-2 grid ${buttonRow}`}>
        <button onClick={handleDownload} className={ghostButton}>
          <IoMdDownload className="text-base" aria-hidden />
          Ladda ned
        </button>
        {isLoggedIn && user && (
          <button onClick={handleDelete} className={dangerGhostButton}>
            <IoMdTrash className="text-base" aria-hidden />
            Ta bort
          </button>
        )}
      </div>
    </div>
  );
}
