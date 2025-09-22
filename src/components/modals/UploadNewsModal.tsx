import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import MarkdownRenderer from "../MarkdownRenderer";

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
  user = null, // <-- Default to null if no user is provided
}: UploadDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [docsData, setDocsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const path = useParams();
  const org = path.orgname;
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleOpenDocPicker = async () => {
    if (!org) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/${org}/document`);
      if (!res.ok) throw new Error("Kunde inte hämta dokument");
      const data = await res.json();
      setDocsData(data || []);
    } catch (err: any) {
      setError(err?.message ?? "Något gick fel när dokument hämtades");
    } finally {
      setLoading(false);
    }
  };

  // ---- Markdown helpers ----
  const insertAtCursor = (
    snippet: string,
    selectStartOffset = 0,
    selectEndOffset = 0
  ) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? content.length;
    const end = ta.selectionEnd ?? content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = before + snippet + after;
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      const caret = start + snippet.length;
      ta.selectionStart = caret + selectStartOffset;
      ta.selectionEnd = caret + selectEndOffset;
    });
  };

  const wrapSelection = (pre: string, post: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const selected = content.slice(start, end) || "text";
    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = before + pre + selected + post + after;
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      const caretStart = start + pre.length;
      const caretEnd = caretStart + selected.length;
      ta.selectionStart = caretStart;
      ta.selectionEnd = caretEnd;
    });
  };

  const prefixLines = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = content.slice(0, start);
    const selection = content.slice(start, end);
    const after = content.slice(end);
    const block = (selection || "punkt")
      .split("\n")
      .map((l) => (l.trim().length ? `${prefix}${l}` : l))
      .join("\n");
    const next = before + block + after;
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start;
      ta.selectionEnd = start + block.length;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("href", link);
    formData.append("author", user || "Okänd"); // or user.id if you want to store the ID
    if (image) formData.append("image", image);
    if (selectedDoc) formData.append("documentId", selectedDoc);

    const res = await fetch(`/api/${org}/news`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Optionally handle success, e.g. refresh news list
      setTitle("");
      setContent("");
      setImage(null);
      setLink("");
      onClose();
    } else {
      // Optionally handle error
      setError("Kunde inte spara nyhet");
    }
  };

  const validateLink = (val: string) => {
    if (!val) {
      setLinkError("");
      return true;
    }
    try {
      // Allow missing protocol by trying to add https://
      const withProto = val.match(/^https?:\/\//i) ? val : `https://${val}`;
      new URL(withProto);
      setLinkError("");
      return true;
    } catch {
      setLinkError("Ogiltig länk. Ex: https://exempel.se/nyhet");
      return false;
    }
  };

  const handleOnClose = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setLink("");
    setSelectedDoc(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative overflow-auto max-h-[90vh]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-[#2F5D50] mb-4">
          Lägg till nyhet
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview((p) => !p)}
            className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
            aria-pressed={isPreview}
          >
            {isPreview ? "Redigera" : "Förhandsgranska"}
          </button>
        </div>

        <label className="block mb-2 font-medium">Titel</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="block mb-2 font-medium">
              Innehåll (Markdown)
            </label>
            {!isPreview && (
              <div className="flex flex-wrap gap-1 text-sm">
                <button
                  type="button"
                  title="Fetstil"
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() => wrapSelection("**", "**")}
                >
                  Fet (**B**)
                </button>
                <button
                  type="button"
                  title="Kursiv"
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() => wrapSelection("_", "_")}
                >
                  Kursiv ( _I_ )
                </button>
                <button
                  type="button"
                  title="Rubrik 2"
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() => insertAtCursor("\n## ")}
                >
                  Rubrik (##)
                </button>
              </div>
            )}
          </div>
          {!isPreview ? (
            <textarea
              ref={taRef}
              className="w-full border rounded px-3 py-2 min-h-[160px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          ) : (
            <div className="w-full max-h-[200px] border rounded px-3 py-3 max-w-none overflow-scroll">
              <MarkdownRenderer
                className="overflow-scroll"
                content={content || "_(Inget innehåll ännu)_"}
              />
            </div>
          )}
        </div>
        <label className="block mb-2 font-medium">Länk (valfritt)</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onBlur={(e) => validateLink(e.target.value)}
          placeholder="https://exempel.se/nyhet"
        />
        {linkError && (
          <div className="text-red-500 mt-1 text-sm">{linkError}</div>
        )}
        <label className="block mb-2 font-medium">Bild (valfritt)</label>
        <input
          type="file"
          accept="image/*"
          // Let camera open on mobile if the user prefers:
          capture="environment"
          className="mb-4 border border-forest rounded px-3 py-3 w-full cursor-pointer hover:bg-gray-100"
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
            className="px-4 py-2 rounded bg-forest text-white cursor-pointer hover:bg-forest/90 transition"
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
