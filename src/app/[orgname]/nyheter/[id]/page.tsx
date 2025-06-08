"use client";
import PageSpinner from "@/components/features/PageSpinner";
import { NewsDTO } from "@/types/dtos";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewsPage() {
  const [news, setNews] = useState<NewsDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const param = useParams();
  const org = param.orgname;
  const id = param.id;

  useEffect(() => {
    if (!org || !id) return;
    setLoading(true);
    fetch(`/api/${org}/news/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta nyheter");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [org, id]);

  if (loading) return <PageSpinner />;

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        {error}
      </div>
    );

  if (!news)
    return (
      <div className="text-center text-gray-600 mt-10">
        Ingen nyhet hittades.
      </div>
    );

  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-8 text-black">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-green-900">{news.title}</h1>
        <p className="text-sm text-gray-600 mt-2">
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

      {news.image && (
        <div className="rounded-lg overflow-hidden shadow-md mb-6">
          <Image
            src={news.image}
            alt={news.title}
            width={800}
            height={400}
            className="w-full object-cover"
          />
        </div>
      )}

      <section className="prose max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:text-green-900 prose-img:rounded-lg prose-a:text-orange-700 prose-a:underline hover:prose-a:text-orange-900">
        <p>{news.content}</p>
      </section>
      {(news.href || news.documents.length > 0) && (
        <footer className="mt-8 border-t pt-6 flex flex-col gap-4">
          {news.href && (
            <a
              href={news.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-orange font-semibold hover:underline"
            >
              {news.href}
            </a>
          )}

          {news.documents.length > 0 && (
            <a
              href={`/docs/${news.documents[0].path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-forest p-2 rounded-md text-orange font-semibold hover:underline hover:bg-forest hover:text-white transition-colors duration-300"
            >
              <img src="/icons/pdf-icon.png" alt="pdf" className="w-10" />
              Förhandsgranska: <span>
                {news.documents[0].title}
              </span> &rarr;{" "}
            </a>
          )}
        </footer>
      )}
    </article>
  );
}
