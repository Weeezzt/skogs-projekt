"use client";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

interface UploadRulesDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "fiske" | "jakt";
  onUploaded: () => void;
}

export default function UploadRulesDocumentModal({
  isOpen,
  onClose,
  type,
  onUploaded,
}: UploadRulesDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const org = params.orgname;

  const tag = type === "fiske" ? "fiske-regler" : "jakt-regler";
  const label = type === "fiske" ? "fiskeregler" : "jaktregler";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(null);
    onClose();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("folderName", "Jakt & Fiske");
    formData.append("tags", tag);
    formData.append("files", file);

    try {
      const res = await fetch(`/api/${org}/document`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Uppladdning misslyckades");
      setFile(null);
      onUploaded();
      onClose();
    } catch {
      setError("Kunde inte ladda upp dokumentet. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-forest mb-2">
          Uppdatera {label}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Det nya dokumentet ersätter den aktuella nedladdningslänken för alla
          besökare.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-orange text-white px-4 py-2 rounded-lg hover:opacity-90 font-semibold text-sm"
          >
            Välj PDF
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-sm text-forest">
            {file ? file.name : "Ingen fil vald"}
          </span>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
          >
            Avbryt
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-orange text-white rounded hover:opacity-90 text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Laddar upp..." : "Ladda upp"}
          </button>
        </div>
      </div>
    </div>
  );
}
