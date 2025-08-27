"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type OrgKey = "sorsele" | "tarna-stensele";

const ORG_CONTENT: Record<
  OrgKey,
  {
    heading: string;
    certLabel: string;
    hero: string;
    gallery: { src: string; alt: string }[];
    paragraphs: string[];
  }
> = {
  sorsele: {
    heading: "Sorsele Övre Allmänningsskog",
    certLabel: "FSC®",
    hero: "/skogsbruk-soa.jpg",
    gallery: [
      { src: "/skog.png", alt: "Berg och skog i Tärna" },
      { src: "/skog-sjo-ovan.png", alt: "Skogsväg med dimma" },
      { src: "/skogstor.jpg", alt: "Gran- och tallskog" },
    ],
    paragraphs: [
      "Sorsele Övre Allmänningsskog bedriver ett aktivt och hållbart skogsbruk som syftar till långsiktig produktion av virkesråvara, samtidigt som naturvärden och andra intressen beaktas.",
      "Sorsele Övre Allmänningsskog avverkar årligen c:a 10000-15000 m3fub företrädesvis i form av försäljningsposter. Skogsvård bedrivs i egen regi.",
      "Ambitionen är att skapa en balans mellan virkesproduktion, biologisk mångfald och rekreationsvärden – något som gagnar både dagens och framtidens intressenter.",
    ],
  },
  "tarna-stensele": {
    heading: "Tärna-Stensele Allmänningsskog",
    certLabel: "PEFC™",
    hero: "/skog.png",
    gallery: [
      { src: "/tsa-diagram.jpg", alt: "Berg och skog i Tärna" },
      { src: "/skog-sjo-ovan.png", alt: "Skogsväg med dimma" },
      { src: "/skogstor.jpg", alt: "Gran- och tallskog" },
    ],
    paragraphs: [
      "Diagrammet visar hur avverkningen har varierat över tid. Underlaget bygger främst på TSA:s förvaltningsberättelser; för de tidigaste åren är uppgifterna ofullständiga och vissa värden är uppskattningar.",
      "Åren 1921–1924 förekom i princip ingen reguljär avverkning; endast virke i samband med vägbygget Slussfors–Tärnaby togs ut, och 1923–1924 utsynades cirka 8 000 m³sk per år utan att några poster försåldes.",
      "Från 1925, när hushållningsplanen var klar, låg utsyningen omkring 20 000–25 000 m³sk per år. Försäljningen under 1930-talet försvårades av bristen på flottleder. År 1931 finns en samlad redovisning och till och med 1939 sköttes bevakning och förvaltning av Kungliga Domänstyrelsen.",
    ],
  },
};

export default function SkogsbrukPage() {
  const params = useParams() as { orgname?: string };
  const orgParam = (params.orgname || "sorsele").toLowerCase();
  const org: OrgKey =
    orgParam === "tarna-stensele" ? "tarna-stensele" : "sorsele";
  const cfg = ORG_CONTENT[org];

  // 🔍 Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ESC + arrows
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i === null ? i : (i + 1) % cfg.gallery.length
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? i : (i - 1 + cfg.gallery.length) % cfg.gallery.length
        );
    };
    window.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxIndex, cfg.gallery.length]);

  return (
    <main className="mx-auto my-10 max-w-5xl px-4 pb-12 text-gray-800">
      {/* Hero */}
      <section className="relative rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72">
          <Image
            src={cfg.hero}
            alt={cfg.heading}
            fill
            priority
            className="object-cover brightness-95 contrast-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
          />
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-beige drop-shadow">
              Skogsbruk
            </h1>
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-forest">
          {cfg.heading}
        </h2>
      </header>

      {/* Body */}
      <section className="space-y-4 leading-relaxed text-lg">
        {cfg.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      {/* Image gallery */}
      <section className="mt-10">
        <h3 className="text-xl font-semibold text-forest mb-4">
          Bilder från området
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.gallery.map((img, i) => (
            <figure
              key={img.src}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-zoom-in"
              role="button"
              tabIndex={0}
              aria-label={`Visa större: ${img.alt}`}
              onClick={() => setLightboxIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setLightboxIndex(i);
              }}
            >
              {/* 16:9 frame */}
              <div className="w-full pb-[56.25%]" />
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-beige text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 🔍 Lightbox overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cfg.gallery[lightboxIndex].src}
              alt={cfg.gallery[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="(max-width: 1536px) 90vw, 1400px"
              priority
            />

            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="cursor-pointer absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow"
              aria-label="Stäng"
            >
              Stäng
            </button>

            {/* Prev/Next (desktop) */}
            {cfg.gallery.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + cfg.gallery.length) %
                        cfg.gallery.length
                    )
                  }
                  className="cursor-pointer hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow text-gray-900"
                  aria-label="Föregående"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % cfg.gallery.length)
                  }
                  className=" cursor-pointer hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow text-gray-900"
                  aria-label="Nästa"
                >
                  ›
                </button>
              </>
            )}

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white p-3 text-sm">
              {cfg.gallery[lightboxIndex].alt}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
