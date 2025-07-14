"use client";
import { useEffect, useMemo, useState } from "react";
import DocumentGrid from "@/components/document/DocumentGrid";
import DocumentList from "@/components/document/DocumentList";
import DocumentSearchBar from "@/components/document/DocumentSearchBar";
import { CiGrid41, CiGrid2H } from "react-icons/ci";

import FolderFilter from "@/components/document/Folderfilter";
import MultiSelectDropdown from "@/components/document/DocumentSortSelector";
import UploadDocumentModal from "@/components/modals/UploadDocumentModal";
import { useUserSession } from "@/hooks/useUserSession";
import { usePathname } from "next/navigation";
import { DocumentDTO } from "@/types/dtos";

const sortOptions = [
  { label: "Senaste", value: "latest" },
  { label: "Äldsta", value: "oldest" },
  { label: "Titel A-Ö", value: "title_az" },
  { label: "Titel Ö-A", value: "title_za" },
];
export default function Dokument() {
  const [isGridLayout, setIsGridLayout] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [activeCategories, setActiveCategories] = useState<string[] | null>(
    null
  );
  const [docsData, setDocsData] = useState<DocumentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoggedIn, user } = useUserSession();

  const pathname = usePathname();
  const org = pathname.split("/")[1];

  useEffect(() => {
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
  }, [org]);

  const [filteredDocuments, setFilteredDocuments] =
    useState<DocumentDTO[]>(docsData);
  const [selectedSort, setSelectedSort] = useState<string | number>("");
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSortChange = (sortValue: string | number) => {
    setSelectedSort(sortValue);
    console.log("Selected sort option:", sortValue);
  };

  const toggleLayout = () => {
    setIsGridLayout((prev) => !prev);
  };

  const sortFunctions: Record<
    string,
    (a: DocumentDTO, b: DocumentDTO) => number
  > = {
    latest: (a, b) =>
      (a.uploadedAt.toString() || "").localeCompare(
        b.uploadedAt.toString() || ""
      ),
    oldest: (a, b) =>
      (b.uploadedAt.toString() || "").localeCompare(
        a.uploadedAt.toString() || ""
      ),
    title_az: (b, a) => a.title.localeCompare(b.title),
    title_za: (b, a) => b.title.localeCompare(a.title),
  };

  useEffect(() => {
    let filtered = docsData;

    if (activeCategories && activeCategories.length > 0) {
      filtered = filtered.filter((doc) =>
        activeCategories.includes(doc.category)
      );
    }
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(lowerQuery)
      );
    }
    if (selectedSort && sortFunctions[selectedSort]) {
      filtered.sort(sortFunctions[selectedSort]);
    }

    setFilteredDocuments(filtered);
  }, [docsData, query, activeCategories, selectedSort]);

  const allFolders = useMemo(() => {
    const folderSet = new Set<string>();
    docsData.forEach((doc) => {
      if (doc.category) {
        folderSet.add(doc.category);
      }
    });
    return Array.from(folderSet);
  }, [docsData]);

  return (
    <main className="w-full mx-auto mt-8 grid">
      <div className="w-full flex justify-between px-4 items-center md:w-[600px] lg:w-[800px] xl:w-[1000px] shadow-md bg-beige min-h-20 mx-auto mb-6">
        <div className="flex w-full gap-4">
          <DocumentSearchBar query={query} onQueryChange={handleQueryChange} />
          <MultiSelectDropdown
            options={sortOptions}
            value={selectedSort}
            onChange={handleSortChange}
            placeholder="Välj sortering..."
          />

          {isLoggedIn && user && (
            <button
              className=" font-bold w-40 h-[44px] ml- cursor-pointer justify-center items-center rounded-lg border-2 border-forest text-forest hover:border-orange hover:text-orange transition-colors duration-300"
              onClick={() => setUploadModalOpen(true)}
            >
              Ladda upp
            </button>
          )}
        </div>

        <button
          className=" w-[44px] h-[44px] flex text-4xl cursor-pointer justify-center items-center rounded-lg border-2 border-forest text-forest hover:border-orange hover:text-orange transition-colors duration-300"
          onClick={toggleLayout}
        >
          {!isGridLayout ? <CiGrid41 /> : <CiGrid2H />}
        </button>
      </div>
      <div className="mx-auto w-full flex justify-between items-center md:w-[600px] lg:w-[800px] xl:w-[1000px]">
        <FolderFilter
          documents={docsData}
          activeCategories={activeCategories}
          onCategoriesChange={(cat) => setActiveCategories(cat)}
        />
      </div>
      <div>
        {loading && (
          <div className="text-center text-gray-500">Laddar dokument...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {isGridLayout ? (
          <DocumentGrid documents={filteredDocuments} />
        ) : (
          <DocumentList documents={filteredDocuments} />
        )}
      </div>
      <UploadDocumentModal
        existingFolders={allFolders}
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={(files, folder) => {
          console.log("Files:", files, "Folder:", folder);
          // send to backend or handle locally
        }}
      />
    </main>
  );
}
