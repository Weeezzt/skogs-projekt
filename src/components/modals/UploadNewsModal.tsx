import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (news: {
    title: string;
    description: string;
    content: string;
    tags: string[];
    image: File | null;
    link: string;
  }) => void;
  user?: string | null; // <-- Add user prop if needed
  existingTags?: string[]; // <-- Add this prop
}

export default function UploadNewsModal({
  isOpen,
  onClose,
  onUpload,
  existingTags = [
    "fiske",
    "jakt",
    "möte",
    "protokoll",
    "beslut",
    "digitalisering",
    "teknik",
    "älg",
    "skador",
  ],
  user = null, // <-- Default to null if no user is provided
}: UploadDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [docsData, setDocsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const path = useParams();
  const org = path.orgname;
  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  function isValidUrl(url: string) {
    try {
      // Accept empty string as "no link"
      if (!url) return true;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const handleOpenDocPicker = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/${org}/document`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta dokument");
        return res.json();
      })
      .then((data) => setDocsData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(link)) {
      setLinkError("Länken måste vara en giltig URL (t.ex. https://...)");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("href", link);
    formData.append("author", user || "Okänd"); // or user.id if you want to store the ID
    tags.forEach((tag) => formData.append("tags", tag));
    if (image) formData.append("image", image);
    if (selectedDoc) formData.append("documentId", selectedDoc);

    const res = await fetch(`/api/${org}/news`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Optionally handle success, e.g. refresh news list
      setTitle("");
      setDescription("");
      setContent("");
      setTags([]);
      setImage(null);
      setLink("");
      onClose();
    } else {
      // Optionally handle error
      setError("Kunde inte spara nyhet");
    }
  };

  const handleOnClose = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setTags([]);
    setImage(null);
    setLink("");
    setSelectedDoc(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-[#2F5D50] mb-4">
          Lägg till nyhet
        </h2>

        <label className="block mb-2 font-medium">Titel</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Innehåll</label>
        <textarea
          className="w-full border rounded px-3 py-2 mb-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <label className="block mb-2 font-medium">Länk (valfritt)</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Bild (valfritt)</label>
        <input
          type="file"
          accept="image/*"
          className="mb-4 border border-forest rounded px-3 py-2 w-full cursor-pointer hover:bg-gray-100"
          onChange={handleImageChange}
        />
        <label className="block mb-2 font-medium">
          Koppla till dokument (valfritt)
        </label>
        <select
          onClick={handleOpenDocPicker}
          value={selectedDoc || "Välj dokument"}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="mb-4 border border-forest rounded px-3 py-2 w-full cursor-pointer hover:bg-gray-100"
        >
          <option value="">Välj dokument</option>
          {docsData.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.title}
            </option>
          ))}{" "}
        </select>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 cursor-pointer hover:bg-gray-300 transition"
            onClick={handleOnClose}
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#2F5D50] text-white cursor-pointer hover:bg-[#2F5D50]/90 transition"
          >
            Spara nyhet
          </button>
          {(error || linkError) && (
            <div className="text-red-500 mt-2">{error || linkError}</div>
          )}
        </div>
      </form>
    </div>
  );
}
