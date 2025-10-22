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
import TooltipZone from "@/components/TooltipZone";
import LoadingIndicator from "@/components/LoadingIndicator";

const sortOptions = [
  { label: "Senaste", value: "latest" },
  { label: "Äldsta", value: "oldest" },
  { label: "Titel A-Ö", value: "title_az" },
  { label: "Titel Ö-A", value: "title_za" },
];
export default function Dokument() {
  const [isGridLayout, setIsGridLayout] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [docsData, setDocsData] = useState<DocumentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // update screenWidth on resize (simple)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // set initial
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // choose doc card variant based on width
  const smallScreen = screenWidth < 600;

  const { isLoggedIn, user } = useUserSession();

  const pathname = usePathname();
  const org = pathname.split("/")[1];

  const fetchDocuments = () => {
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

  useEffect(() => {
    fetchDocuments();
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
      (b.uploadedAt?.toString() || "").localeCompare(
        a.uploadedAt?.toString() || ""
      ),
    oldest: (a, b) =>
      (a.uploadedAt?.toString() || "").localeCompare(
        b.uploadedAt?.toString() || ""
      ),
    title_az: (a, b) => a.title.localeCompare(b.title, "sv"),
    title_za: (a, b) => b.title.localeCompare(a.title, "sv"),
  };

  useEffect(() => {
    let filtered = docsData;
    if (!activeCategory) {
      setFilteredDocuments([]);
      return;
    }
    if (activeCategory && activeCategory.length > 0) {
      filtered = filtered.filter((doc) => activeCategory === doc.category);
    }
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((doc) =>
        doc.title.toLowerCase().includes(lowerQuery)
      );
    }
    if (selectedSort && sortFunctions[selectedSort]) {
      filtered = [...filtered].sort(sortFunctions[selectedSort]); // sort a copy!
    }

    setFilteredDocuments(filtered);
  }, [docsData, query, activeCategory, selectedSort]);

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
      <div className="w-full flex justify-between px-4 items-center md:w-[600px] lg:w-[800px] xl:w-[1000px] shadow-md bg-forest-dark min-h-20 mx-auto mb-6">
        <div className="flex w-full gap-4 mr-1">
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

        <TooltipZone
          variant="light"
          delay={500}
          tooltip="Byt layout mellan grid och lista"
        >
          <button
            className=" w-[44px] h-[44px] flex text-4xl cursor-pointer justify-center items-center rounded-lg border-2 border-orange/70 text-orange/70 hover:border-orange hover:text-orange transition-colors duration-300"
            onClick={toggleLayout}
          >
            {!isGridLayout || smallScreen ? <CiGrid41 /> : <CiGrid2H />}
          </button>
        </TooltipZone>
      </div>
      <div className="px-2 mx-auto w-full flex justify-between items-center md:w-[600px] lg:w-[800px] xl:w-[1000px]">
        <FolderFilter
          documents={docsData}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
        />
      </div>
      <div>
        {loading && (
          <LoadingIndicator variant="bars" size={80} tintOpacity={1} />
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {(isGridLayout && activeCategory) || smallScreen ? (
          <DocumentGrid documents={filteredDocuments} />
        ) : (
          <DocumentList documents={filteredDocuments} />
        )}
        {!activeCategory && !loading && (
          <div className="mb-12 sm:mb-6 md:mb-0 text-center text-beige/70 mt-20">
            Vänligen välj en mapp för att visa dokument.
          </div>
        )}
      </div>
      <UploadDocumentModal
        existingFolders={allFolders}
        isOpen={uploadModalOpen}
        onClose={() => {
          fetchDocuments();
          setUploadModalOpen(false);
        }}
      />
    </main>
  );
}
