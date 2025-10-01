"use client";
import DocumentCard from "@/components/document/DocumentCard";
import StandingCard from "@/features/cards/StandingCard";
import { DocumentDTO, NewsDTO } from "@/types/dtos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LatestNewsCard,
  LatestNewsSkeleton,
} from "@/features/cards/LatestNewsCard";

export default function Home() {
  const [latestNews, setLatestNews] = useState<NewsDTO | null>(null);
  const [latestDocs, setLatestDocs] = useState<DocumentDTO | null>(null);
  const [reglemente, setReglemente] = useState<DocumentDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const organisation = useParams().orgname?.toString();

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

  return (
    <main className=" bg-gradient-to-br from-orange via-forest to-forest/90">
      <section className="relative flex flex-col items-center sm:justify-center min-h-[30vh] md:min-h-[45vh] mt-2 overflow-hidden mb-12">
        <div className="relative flex flex-col items-center sm:justify-center h-full w-full px-4 md:pb-26">
          <h1 className=" text-3xl sm:text-4xl md:text-5xl font-extrabold text-beige drop-shadow-lg text-center mb-4">
            {organisation === "sorsele"
              ? "Sorsele Övre Allmänningsskog"
              : " Tärna-Stensele Allmänningsskog"}
          </h1>
          <p className="text-lg md:text-2xl text-beige text-center max-w-2xl">
            Välkommen till vår gemensamma skog – en plats för natur, gemenskap
            och framtid!
          </p>
        </div>
      </section>
      <section className="mx-auto w-full my-[-50px] md:my-[-100px] xl:my-[-200px] z-20 relative">
        <h2 className="text-2xl md:text-4xl 2xl:text-5xl font-extrabold text-beige mb-8 text-center">
          Senaste Nytt
        </h2>

        <div className="flex md:h-[300px] justify-evenly w-full">
          {loading && <LatestNewsSkeleton />}

          {!loading && latestNews && (
            <LatestNewsCard news={latestNews} organisation={organisation!} />
          )}

          {!loading && !latestNews && (
            <div className="text-center text-forest/80">Inga nyheter ännu.</div>
          )}
        </div>
      </section>
      <section className="w-full flex flex-col md:flex-row sm:w-4/5  md:w-3/4 lg:w-2/3  xl:w-3/5 2xl:w-1/2 p-2 md:justify-around  items-center justify-center mt-12 md:mt-50 py-12 mx-auto ">
        <div className="max-w-4xl w-full px-4">
          <h3 className="text-center font-bold mb-4 text-xl lg:text-2xl xl:text-3xl text-beige">
            Senaste Dokumentet
          </h3>
          {latestDocs ? (
            <DocumentCard variant="grid" documentData={latestDocs} />
          ) : (
            <p className="text-center text-orange font-bold">
              Inga dokument tillgängliga
            </p>
          )}
        </div>
        <div className="max-w-4xl w-full px-4">
          <h3 className="text-center font-bold mb-4 text-xl lg:text-2xl xl:text-3xl text-beige ">
            Reglemente
          </h3>
          {reglemente ? (
            <DocumentCard variant="grid" documentData={reglemente} isSpecial />
          ) : (
            <p className="text-center text-orange font-bold">
              Inget dokument tillgängligt
            </p>
          )}
        </div>
      </section>
      <section className="w-full flex flex-col items-center gap-4 lg:flex-row sm:w-4/5 lg:w-3/3  xl:w-4/5 2xl:w-3/5 p-2 md:justify-around mb-20 mx-auto">
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
