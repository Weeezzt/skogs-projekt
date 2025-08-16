"use client";

import Link from "next/link";
import SmartImage from "./SmartImage";

type Props = {
  item?: {
    id: number | string;
    title: string;
    image?: string | null;
    content?: string | null;
    href?: string | null;
    publishedAt?: Date | null;
  };
  org?: string;
  titleLines?: { base?: number; md?: number };
  contentLines?: { base?: number; md?: number };
};

export default function FeaturedNewsHero({
  item,
  org,
  titleLines = { base: 2, md: 3 },
  contentLines = { base: 1, md: 0 },
}: Props) {
  if (!item) return null;

  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const titleClamp = [
    titleLines.base ? `line-clamp-${titleLines.base}` : "",
    titleLines.md ? `md:line-clamp-${titleLines.md}` : "",
  ].join(" ");

  const contentClamp = [
    contentLines.base ? `line-clamp-${contentLines.base}` : "hidden",
    contentLines.md ? `md:line-clamp-${contentLines.md}` : "",
  ].join(" ");

  if (!item.image) {
    return (
      <section className="max-h-[300px] mt-8 rounded-2xl border border-black/10 bg-white">
        <div className="p-6 sm:p-8">
          {date && <p className="text-xs text-gray-500">{date}</p>}
          <h2
            className={`mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a] ${titleClamp}`}
            title={item.title}
          >
            {item.title}
          </h2>
          {item.content && (
            <p className={`mt-2 text-gray-700 ${contentClamp}`}>
              {item.content}
            </p>
          )}
          <Link
            href={`/${org}/nyheter/${item.id}`}
            className="mt-4 inline-block rounded-md bg-orange px-4 py-2 font-semibold text-beige hover:bg-orange/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70"
          >
            Läs nyheten
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-h-[300px] relative mt-8 overflow-hidden rounded-2xl">
      <div className="relative w-full flex ">
        <SmartImage
          src={item.image}
          alt={item.title}
          preventUpscale
          defaultWidth={1600}
          defaultHeight={900}
          framed={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
        />

        <div className="p-4 sm:p-6 lg:p-8 text-white h-[300px] min-w-1/2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] bg-gradient-to-t from-beige via-forest/40 to-forest">
          {date && <p className="text-xs/5 opacity-85">{date}</p>}

          <h2
            className={`mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight ${titleClamp}`}
            title={item.title}
          >
            {item.title}
          </h2>

          {item.content && (
            <p
              className={` truncate mt-2 max-w-3xl opacity-95 ${contentClamp}`}
            >
              {item.content}
            </p>
          )}

          <Link
            href={`/${org}/nyheter/${item.id}`}
            className="mt-8 inline-block rounded-md bg-orange px-4 py-2 font-semibold text-beige hover:bg-orange/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70"
          >
            Läs nyheten
          </Link>
        </div>
      </div>
    </section>
  );
}
