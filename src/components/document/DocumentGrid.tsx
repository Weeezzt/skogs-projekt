import { DocumentDTO } from "@/types/dtos";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentDTO[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-[1000px] gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} documentData={doc} variant="grid" />
      ))}
    </div>
  );
}
