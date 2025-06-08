import { DocumentDTO } from "@/types/dtos";
import DocumentCard from "./DocumentCard";

interface DocumentListProps {
  documents: DocumentDTO[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="w-full max-w-[1000px] mx-auto space-y-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} documentData={doc} variant="list" />
      ))}
    </div>
  );
}
