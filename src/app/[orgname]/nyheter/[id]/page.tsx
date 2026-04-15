"use client";

import Image from "next/image";
import Link from "next/link";
import { NewsDTO } from "@/types/dtos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useUserSession } from "@/hooks/useUserSession";
import UploadNewsModal from "@/components/modals/UploadNewsModal";

export default function NewsPage() {
  const [news, setNews] = useState<NewsDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const { isLoggedIn, user } = useUserSession();
  const param = useParams();
  const org = param.orgname as string | undefined;
  const id = param.id as string | undefined;

  const handleDeleteNews = async () => {
    if (window.confirm("Är du säker på att du vill ta bort nyheten?")) {
      await fetch(`/api/${org}/news/${id}`, {
        method: "DELETE",
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!org || !id) return;
    setLoading(true);
    fetch(`/api/${org}/news/${id}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta nyheter");
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setImgError(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [org, id]);

  if (loading) return <NewsDetailSkeleton />;

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        {error}
      </div>
    );

  if (!news)
    return (
      <div className="text-center text-beige/70 mt-10">
        Ingen nyhet hittades.
      </div>
    );

  const imageSrc = !imgError && news.image ? news.image : "/ritadhero.png";

  const handleOpenEditNewsModal = () => {
    setEditModalOpen(true);
  };
  const onEditSaved = () => {
    //refresh page to show updated news
    window.location.reload();
  };

  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-8 text-beige/95">
      <Link
        href={`/${org}/nyheter`}
        className="inline-flex items-center gap-1 text-sm text-beige/70 hover:text-orange transition-colors mb-6"
      >
        ← Tillbaka till nyheter
      </Link>
      <header className="mb-6">
        <h1 className="text-3xl md:text-3xl font-bold text-beige leading-tight">
          {news.title}
        </h1>
        <p className="text-sm text-beige/70 mt-2">
          {news.author && (
            <>
              <span className="font-medium">{news.author}</span> &bull;{" "}
            </>
          )}
          {news.publishedAt &&
            new Date(news.publishedAt).toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </header>

      {/* Hero media (fixed 16:9) */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-8 max-h-[70vh]">
        <div className="w-full pb-[56.25%]" />
        {/* blurred backdrop */}
        <Image
          src={imageSrc}
          alt={news.title}
          fill
          className="object-cover blur-sm scale-105"
          aria-hidden
          priority
        />
        {/* main image */}
        <Image
          src={imageSrc}
          alt={news.title}
          fill
          priority
          onError={() => setImgError(true)}
          onLoadingComplete={({ naturalWidth, naturalHeight }) =>
            setIsPortrait(naturalHeight > naturalWidth)
          }
          className={
            isPortrait
              ? "object-contain z-10"
              : "object-cover z-10 brightness-95 contrast-110"
          }
          sizes="(max-width: 768px) 100vw, 900px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35" />
      </div>
      <section className="prose prose-lg max-w-none prose-headings:text-forest prose-strong:text-forest prose-a:text-orange hover:prose-a:text-orange/80 prose-img:rounded-lg prose-li:marker:text-forest">
        <MarkdownRenderer proseClassName="" content={news.content} />
      </section>

      {(news.href || (news.documents && news.documents.length > 0)) && (
        <div className="mt-10 border-t pt-6 flex flex-col gap-4">
          {news.href && (
            <a
              href={news.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-orange font-semibold hover:underline break-all"
            >
              {news.href}
            </a>
          )}

          {news.documents?.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-3">
              {news.documents.map((doc) => {
                const href = doc.path?.startsWith("http")
                  ? doc.path
                  : `/docs/${doc.path}`;
                return (
                  <li key={doc.path}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 border-2 border-forest-dark p-3 rounded-lg text-beige/80 hover:bg-white/5 hover:text-beige transition-colors duration-300"
                    >
                      <img
                        src="/icons/pdf-icon.png"
                        alt="pdf"
                        className="w-6 h-6"
                      />
                      <span className="truncate font-semibold">
                        {doc.title}
                      </span>
                      <span aria-hidden className="ml-auto">
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {isLoggedIn && user && (
        <>
          <div className="hidden md:flex gap-4 mt-4">
            <button
              onClick={handleOpenEditNewsModal}
              className=" inline self-start bg-beige text-orange px-4 py-2 rounded-md font-semibold hover:border-red-700/90 transition cursor-pointer hover:bg-orange hover:text-beige duration-300"
            >
              Redigera nyheten
            </button>
            <button
              onClick={handleDeleteNews}
              className=" self-start bg-beige text-red-700 px-4 py-2 rounded-md font-semibold hover:border-red-700/90 transition cursor-pointer hover:bg-red-700 hover:text-beige duration-300"
            >
              Radera nyheten
            </button>
          </div>
        </>
      )}

      <UploadNewsModal
        mode="edit"
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user?.name || null}
        existingNews={{
          id: news.id.toString(),
          title: news.title,
          content: news.content,
          href: news.href,
          documentId:
            news.documents && news.documents.length > 0
              ? news.documents[0].id.toString()
              : null,
        }}
        onSaved={onEditSaved}
      />
    </article>
  );
}

/** Skeleton that matches the exact layout */
function NewsDetailSkeleton() {
  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Title + meta placeholders */}
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-40 bg-gray-200 rounded mb-6 animate-pulse" />

      {/* Hero media (16:9) skeleton */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="w-full pb-[56.25%]" />
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-x-1 -inset-y-4 translate-x-[-100%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.6s_infinite]" />
        </div>
      </div>

      {/* Body placeholders */}
      <div className="space-y-3">
        <div className="h-4 w-[95%] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-[85%] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </article>
  );
}
