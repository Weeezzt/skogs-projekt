import { useParams } from "next/navigation";
import { useRef, useState } from "react";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], folder: string) => void;
  existingFolders: string[];
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
  existingFolders,
}: UploadDocumentModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [newFolder, setNewFolder] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setSelectedFolder("");
    setNewFolder("");
    onClose();
  };

  const params = useParams();
  const org = params.orgname;

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();

    // If newFolder is filled, send as folderName, else send selectedFolder as folderName
    if (newFolder.trim()) {
      formData.append("folderName", newFolder.trim());
    } else if (selectedFolder) {
      formData.append("folderName", selectedFolder);
    } else {
      // No folder selected or entered
      return;
    }

    files.forEach((file) => formData.append("files", file));

    try {
      await fetch(`/api/${org}/document`, {
        method: "POST",
        body: formData,
      });
      setFiles([]);
      setSelectedFolder("");
      setNewFolder("");
      onClose();
    } catch (err) {
      // Optionally handle error here
      alert("Kunde inte ladda upp dokument.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative">
        <h2 className="text-xl font-bold text-[#2F5D50] mb-4">
          Ladda upp dokument
        </h2>

        {/* Drag & Drop area */}
        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-md p-6 text-center text-gray-600 mb-4 cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-orange bg-orange/10"
                : "border-orange/60 hover:border-orange"
            }
          `}
        >
          Dra och släpp fil här
        </div>

        <div className="text-center text-gray-500 mb-2">eller</div>

        {/* File picker */}
        <div className="flex justify-start items-center mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-orange text-white px-4 py-2 rounded cursor-pointer hover:bg-orange/90 font-semibold"
          >
            Välj fil(er)
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="m-2 text-md text-forest min-h-[1.5em]">
            {files.length === 0 && <span>Ingen fil vald</span>}
            {files.length === 1 && <span>{files[0].name}</span>}
            {files.length > 1 && <span>{files.length} filer valda</span>}
          </div>
        </div>

        {/* Select existing folder */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Välj befintlig mapp
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">-- Välj mapp --</option>
            {existingFolders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* Create new folder */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eller skapa ny mapp
          </label>
          <input
            disabled={!!selectedFolder}
            type="text"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            placeholder="t.ex. Årsredovisningar 2025"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm cursor-pointer"
          >
            Avbryt
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-orange text-white rounded hover:bg-orange/90 cursor-pointer text-sm font-semibold"
            disabled={files.length === 0 || (!selectedFolder && !newFolder)}
          >
            Ladda upp
          </button>
        </div>
      </div>
    </div>
  );
}
