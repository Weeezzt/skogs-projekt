"use client";
import HorizontalSlider from "@/features/sliders/HorizontalSlider";
import { HiPlusSm } from "react-icons/hi";

import { NewsDTO } from "@/types/dtos";

import NewsCard from "@/features/cards/NewsCard";
import PageSearch from "@/features/search/PageSearch";
import { useUserSession } from "@/hooks/useUserSession";
import UploadNewsModal from "@/components/modals/UploadNewsModal";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Nyheter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newsData, setNewsData] = useState<NewsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const org = pathname.split("/")[1];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/${org}/news`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta nyheter");
        return res.json();
      })
      .then((data) => setNewsData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [org]);

  const onCloseModal = () => {
    setIsOpen(false);
  };
  const onUploadNews = () => {
    setIsOpen(true);
  };
  const { isLoggedIn, user } = useUserSession();
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Carousel */}

      <HorizontalSlider />

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 my-8 items-center">
        <PageSearch
          sections={newsData.map((news) => ({
            ...news,
            id: news.id.toString(),
          }))}
        />
        <select className="border-2 rounded px-3 py-2 w-40 cursor-pointer">
          <option value="">Alla år</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="Tidigare">Tidigare</option>
        </select>
        <select className="border-2 rounded px-3 py-2 w-40 cursor-pointer">
          <option value="">Typ av nyhet</option>
          <option value="JF">Jakt & Fiske</option>
          <option value="Stämma">Stämma</option>
          <option value="Dokument">Dokument</option>
          <option value="Skog">Skog</option>
        </select>

        {isLoggedIn && user && (
          <button
            onClick={() => setIsOpen(true)}
            className="ml-auto text-3xl text-forest border-2 border-forest rounded-lg w-10 h-10 flex items-center justify-center hover:border-orange hover:text-orange transition-colors duration-300 cursor-pointer"
          >
            <HiPlusSm />
          </button>
        )}
        {/* Add more filters as needed */}
      </div>

      {/* News List */}
      <section className="flex flex-col gap-10">
        {newsData.map((news, idx) => (
          <NewsCard
            key={news.id || idx}
            title={news.title}
            id={news.id}
            description={news.content}
            imageSrc={news.image}
            imageAlt={news.image ? news.title : null}
            author={news.author}
            date={news.publishedAt}
            href={news.href}
            documents={news.documents}
          />
        ))}
      </section>
      <UploadNewsModal
        isOpen={isOpen}
        onClose={onCloseModal}
        onUpload={onUploadNews}
        user={user?.name} // Assuming user object has name or email
      />
    </main>
  );
}
