import { DocumentDTO } from "@/types/dtos";
import DocumentCard from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentDTO[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
  return (
    <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:w-[1200px] gap-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} documentData={doc} variant="grid" />
      ))}
    </div>
  );
}
