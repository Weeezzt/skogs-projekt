// components/LatestNewsCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { NewsDTO } from "@/types/dtos";

const cardShell =
  "relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/5 2xl:w-1/2 " +
  "mx-2 rounded-lg shadow-lg overflow-hidden min-h-[260px] md:h-[300px]";

type CardProps = {
  news: NewsDTO;
  organisation: string;
};

export function LatestNewsCard({ news, organisation }: CardProps) {
  const hasImage = !!news.image;

  return (
    <div className={`${cardShell}`}>
      {/* Background */}
      {hasImage ? (
        <>
          <Image
            src={news.image ?? "/public/fallback/news-fallback-16x9.png"}
            alt={news.title}
            fill
            className="object-cover brightness-90 contrast-125"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
            priority
          />
          {/* Darken + gradient scrim for readability */}
          <div className="absolute inset-0 bg-black/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />
        </>
      ) : (
        // Fallback when no image
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-forest via-forest/90 to-orange/70" />
          {/* Subtle pattern + dim for contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(0,0,0,0.12),transparent_35%)]" />
          <div className="absolute inset-0 bg-black/25" />
        </>
      )}

      {/* Foreground content */}
      <div className="relative z-10 w-full h-full p-4 md:p-6 flex flex-col gap-3 text-beige">
        <h3 className="text-xl md:text-2xl font-bold leading-tight line-clamp-2 drop-shadow">
          {news.title}
        </h3>

        <div className="flex-1">
          <MarkdownRenderer
            content={news.content}
            proseClassName="prose prose-sm md:prose prose-invert"
            truncate
            clampLines={5}
          />
        </div>

        <div className="mt-auto">
          <Link
            href={`/${organisation}/nyheter/${news.id}`}
            className="inline-block bg-orange text-beige font-bold px-4 py-2 rounded-lg hover:bg-orange/80 transition-colors duration-300"
          >
            Läs mer
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LatestNewsSkeleton() {
  return (
    <div className={`${cardShell} animate-pulse`} aria-busy>
      {/* Shimmer base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200" />
      {/* Optional shimmer sweep (pure CSS, no plugin) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-x-1 -inset-y-4 translate-x-[-100%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Foreground placeholders */}
      <div className="relative z-10 w-full h-full p-4 md:p-6 flex flex-col gap-3">
        <div className="h-6 md:h-8 w-3/4 rounded bg-white/60" />
        <div className="space-y-2">
          <div className="h-4 w-[95%] rounded bg-white/50" />
          <div className="h-4 w-[85%] rounded bg-white/50" />
          <div className="h-4 w-[70%] rounded bg-white/50" />
        </div>
        <div className="mt-auto h-10 w-32 rounded bg-white/70" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
