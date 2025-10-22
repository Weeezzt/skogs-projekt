"use client";
import DocumentCard from "@/components/document/DocumentCard";
import StandingCard from "@/features/cards/StandingCard";
import { DocumentDTO, NewsDTO } from "@/types/dtos";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LatestNewsCard,
  LatestNewsSkeleton,
} from "@/features/cards/LatestNewsCard";
import Link from "next/link";
import NewsCard from "@/features/cards/NewsCard";

export default function Home() {
  const [latestNews, setLatestNews] = useState<NewsDTO[] | null>(null);
  const [latestDocs, setLatestDocs] = useState<DocumentDTO | null>(null);
  const [reglemente, setReglemente] = useState<DocumentDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const organisation = useParams().orgname?.toString();

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
  const docVariant = screenWidth < 600 ? "grid" : "list";

  const fetchLatestNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/${organisation}/news/latest`);
      const news = await response.json();
      setLatestNews(news);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Kunde inte hämta senaste nyheter");
    }
  };

  const fetchLatestDocs = async () => {
    try {
      const response = await fetch(`/api/${organisation}/document/latest`);
      if (!response.ok) throw new Error("Kunde inte hämta senaste dokument");
      const docs = await response.json();
      setLatestDocs(docs);
    } catch (err) {
      setError("Fel vid hämtning av senaste dokument");
      return null;
    }
  };

  const fetchReglemente = async () => {
    try {
      const response = await fetch(`/api/${organisation}/document/reglemente`);
      if (!response.ok) throw new Error("Kunde inte hämta reglemente");
      const docs = await response.json();
      setReglemente(docs);
    } catch (err) {
      setError("Fel vid hämtning av reglemente");
      return null;
    }
  };

  useEffect(() => {
    if (!organisation) return;
    fetchLatestNews();
    fetchLatestDocs();
    fetchReglemente();
  }, [organisation]);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return iso;
    }
  };

  const orgTitle = useMemo(() => {
    if (organisation === "sorsele") return "Sorsele Övre Allmänningsskog";
    if (organisation === "tarna-stensele")
      return "Tärna-Stensele Allmänningsskog";
    return "Allmänningsskog";
  }, [organisation]);

  const heroUrl = useMemo(() => {
    // controlled hero image per org (return URL only, don't put it into a Tailwind class)
    return organisation === "sorsele"
      ? "/ritadhero.png"
      : organisation === "tarna-stensele"
      ? "/ritadhero.png"
      : "/ritadhero.png";
  }, [organisation]);

  return (
    <main className=" bg-forest">
      <section
        className={
          "flex min-h-[420px] sm:min-h-[480px] flex-col w-full xl:w-2/3 mx-auto justify-end rounded-xl bg-cover bg-center p-8 mt-12 md:p-12"
        }
        style={{ backgroundImage: `url(${heroUrl})` }}
      >
        <div className="max-w-xl text-white drop-shadow">
          <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Välkommen till {orgTitle}
          </h1>
          <p className="mt-4 text-base font-normal text-white/90 md:text-lg">
            Håll dig uppdaterad om allt som rör allmänningen – från stämmor till
            nyheter, dokument, skogsbruk samt natur- och miljöarbete.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${organisation}/nyheter`}
              className="rounded-lg bg-orange px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:text-base"
            >
              Nyheter
            </Link>
            <Link
              href={`/${organisation}/jakt-fiske`}
              className="rounded-lg bg-white/20 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:text-base"
            >
              Jakt &amp; Fiske
            </Link>
          </div>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row w-5/6 gap-2 lg:gap-0 sm:w-4/5  md:w-3/4 lg:w-2/3 items-center justify-center mt-12 py-12 mx-auto ">
        <div className="w-full lg:mr-2">
          <h3 className="text-center lg:text-left font-semibold mb-4 text-xl lg:text-2xl text-beige">
            Senaste Dokumentet
          </h3>
          {latestDocs ? (
            <DocumentCard variant={docVariant} documentData={latestDocs} />
          ) : (
            <p className="text-center text-orange font-bold">
              Inga dokument tillgängliga
            </p>
          )}
        </div>
        <div className="w-full lg:ml-2">
          <h3 className="text-center lg:text-left font-semibold mb-4 text-xl lg:text-2xl text-beige ">
            Reglemente
          </h3>
          {reglemente ? (
            <DocumentCard variant={docVariant} documentData={reglemente} />
          ) : (
            <p className="text-center text-orange font-bold">
              Inget dokument tillgängligt
            </p>
          )}
        </div>
      </section>
      <section className="mx-auto w-4/5 lg:w-2/3 my-16">
        <h2 className="text-center lg:text-left text-xl md:text-2xl 2xl:text-3xl font-extrabold text-beige mb-8">
          Senaste Nytt
        </h2>

        <div className="flex flex-col gap-6 justify-evenly w-full">
          {loading && <LatestNewsSkeleton />}

          {!loading &&
            latestNews &&
            latestNews.map((news) => (
              <NewsCard
                key={news.id}
                imageSrc={news.image}
                date={news.publishedAt}
                href={news.href}
                orgname={organisation ?? ""}
                id={news.id}
                documents={news.documents}
                title={news.title}
                author={news.author}
                description={news.content}
                imageAlt={news.title}
              />
            ))}
          {!loading && !latestNews && (
            <div className="text-center text-forest/80">Inga nyheter ännu.</div>
          )}
        </div>
      </section>
      <section className="w-full flex flex-col items-center gap-4 lg:flex-row sm:w-4/5 lg:w-2/3 md:justify-between py-10 mx-auto">
        <StandingCard
          title="Jakt och Fiske"
          id="jakt-fiske"
          description="Information om fiskeregler, jaktsäsonger, tilldelningar och regler. Ta del av aktuella jakttillfällen och ansök om jakt inom våra marker."
          imageSrc="/barn-gubbe-hund.jpg"
          href={`/${organisation}/jakt-fiske`}
        />
        <StandingCard
          title="Nyheter"
          id="nyheter"
          description="Bläddra bland de senaste nyheterna, evenemangen och uppdateringarna. Håll dig informerad om vad som händer i vår skog."
          imageSrc="/skidor.jpg"
          href={`/${organisation}/nyheter`}
        />
        <StandingCard
          title="Dokument"
          id="dokument"
          description="Utforska viktiga dokument, protokoll, stadgar och kartor. Här hittar du allt du behöver för att hålla dig uppdaterad om beslut, regler och områden."
          imageSrc="/icons/pdf-icon.png"
          href={`/${organisation}/dokument`}
        />
      </section>
    </main>
  );
}
