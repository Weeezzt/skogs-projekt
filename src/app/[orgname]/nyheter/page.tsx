"use client";
import HorizontalSlider from "@/features/sliders/HorizontalSlider";
import { HiPlusSm } from "react-icons/hi";

import { NewsDTO } from "@/types/dtos";

import NewsCard from "@/features/cards/NewsCard";
import PageSearch from "@/features/search/PageSearch";
import { useUserSession } from "@/hooks/useUserSession";
import UploadNewsModal from "@/components/modals/UploadNewsModal";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import TooltipZone from "@/components/TooltipZone";
import Link from "next/link";
import FeaturedNewsHero from "@/components/FeaturedNewsHero";

export default function Nyheter() {
  const [isOpen, setIsOpen] = useState(false);
  const [newsData, setNewsData] = useState<NewsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [yearFilter, setYearFilter] = useState<string>("");

  const pathname = usePathname();
  const org = pathname.split("/")[1];

  const fetchNews = () => {
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
  };

  useEffect(() => {
    fetchNews();
  }, [org]);

  const onCloseModal = () => {
    fetchNews();
    setIsOpen(false);
  };

  const yearsAvailable = useMemo(() => {
    const set = new Set<string>();
    newsData.forEach((n) => {
      if (!n.publishedAt) return;
      const y = new Date(n.publishedAt).getFullYear().toString();
      set.add(y);
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a)); // newest first
  }, [newsData]);

  const filtered = useMemo(() => {
    let arr = [...newsData];

    if (yearFilter) {
      if (yearFilter === "Tidigare") {
        const cutoff = new Date().getFullYear() - 2; // define “earlier” as older than 2y
        arr = arr.filter((n) => {
          if (!n.publishedAt) return false;
          return new Date(n.publishedAt).getFullYear() <= cutoff;
        });
      } else {
        arr = arr.filter((n) => {
          if (!n.publishedAt) return false;
          return (
            new Date(n.publishedAt).getFullYear().toString() === yearFilter
          );
        });
      }
    }

    // sort newest first by date
    arr.sort((a, b) => {
      const da = a.publishedAt ? +new Date(a.publishedAt) : 0;
      const db = b.publishedAt ? +new Date(b.publishedAt) : 0;
      return db - da;
    });

    return arr;
  }, [newsData, yearFilter]);

  const featured = filtered[0];

  const rest = filtered.slice(1);

  const onUploadNews = () => {
    fetchNews();
  };
  const { isLoggedIn, user } = useUserSession();
  return (
    <main className="w-full max-w-screen-2xl mx-auto px-4 py-8">
      <FeaturedNewsHero item={featured} org={org} />
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 my-8 px-4 items-center">
        <PageSearch
          sections={newsData.map((news) => ({
            ...news,
            id: news.id.toString(),
          }))}
        />

        <div className="flex gap-4 items-center">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border-2 border-forest rounded px-3 py-2 w-40 hover:border-orange transition-colors duration-300 cursor-pointer"
            aria-label="Filtrera på år"
          >
            <option value="">Alla år</option>
            {yearsAvailable.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
            <option value="Tidigare">Tidigare</option>
          </select>
        </div>

        {isLoggedIn && user && (
          <>
            <TooltipZone
              className="ml-auto lg:hidden"
              tooltip="Lägg till nyhet"
              variant="light"
            >
              <button
                onClick={() => setIsOpen(true)}
                className="ml-auto lg:hidden text-3xl text-forest border-2 border-forest rounded-lg w-11 h-11 flex items-center justify-center hover:border-orange hover:text-orange transition-colors duration-300 cursor-pointer"
              >
                <HiPlusSm />
              </button>
            </TooltipZone>
            <button
              onClick={() => setIsOpen(true)}
              className="ml-auto hidden lg:flex items-center gap-2 text-base font-semibold text-forest  border-2 border-forest rounded-lg px-4 py-2  hover:border-orange hover:text-forest transition-colors duration-300 cursor-pointer"
            >
              <HiPlusSm className="text-xl" />
              Lägg till nyhet
            </button>
          </>
        )}
      </div>
      {loading && (
        <p className="px-4 py-8 text-center text-gray-600">Laddar nyheter…</p>
      )}
      {error && (
        <p className="px-4 py-8 text-center text-red-600 font-semibold">
          {error}
        </p>
      )}
      {!loading && !error && rest.length === 0 && (
        <p className="px-4 py-8 text-center text-gray-600">
          Inga fler nyheter att visa.
        </p>
      )}
      {!loading && !error && rest.length > 0 && (
        <section className="flex flex-col gap-10 px-4">
          {rest.map((news, idx) => (
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
              orgname={org}
            />
          ))}
        </section>
      )}
      <UploadNewsModal
        isOpen={isOpen}
        onClose={onCloseModal}
        onUpload={onUploadNews}
        user={user?.name} // Assuming user object has name or email
      />
    </main>
  );
}
