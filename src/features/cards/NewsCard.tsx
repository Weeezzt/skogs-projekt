import MarkdownRenderer from "@/components/MarkdownRenderer";
import { DocumentDTO } from "@/types/dtos";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NewsCardProps {
  title: string;
  id: number | string;
  description: string;
  imageSrc: string | null;
  imageAlt: string | null;
  author: string | null;
  date: Date;
  href: string | null;
  tags?: string[];
  children?: React.ReactNode;
  documents: DocumentDTO[];
  orgname: string;
}

export default function NewsCard({
  title,
  id,
  description,
  imageSrc,
  imageAlt,
  author,
  date,
  href,
  tags,
  children,
  documents,
  orgname,
}: NewsCardProps) {
  const shortenDateAndConvertToLocale = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const router = useRouter();
  const to = `/${orgname}/nyheter/${id}`;

  const onActivate = () => router.push(to);
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };
  return (
    <article
      id={id.toString()}
      role="link"
      tabIndex={0}
      aria-label={title}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className="
        flex flex-col md:flex-row bg-beige/10 rounded-md shadow-md md:h-[150px]
        overflow-hidden w-full cursor-pointer
        transition transform duration-300
        hover:-translate-y-1 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70
      "
    >
      <div className="w-full relative aspect-[16/9] md:w-64 md:aspect-auto md:h-auto flex-shrink-0">
        <Image
          src={imageSrc ?? "/skog-sjo-ovan.png"}
          alt={imageAlt || "News Image"}
          fill
          className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
          style={{
            borderTopLeftRadius: "0.75rem",
            borderBottomLeftRadius: "0.75rem",
          }}
          priority
        />
      </div>
      <div className="flex flex-col flex-1 p-4 justify-center">
        <h3 className="font-bold mb-1 text-beige/90">{title}</h3>

        {(author || date) && (
          <div className="text-xs text-gray-500 mb-2">
            {author && <span>Av {author}</span>}
            {author && date && <span> &middot; </span>}
            {date && <span>{shortenDateAndConvertToLocale(date)}</span>}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-orange/20 text-orange px-2 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
        {href && (
          <a
            href={href}
            className="mt-2 inline-block max-w-2/5 text-orange font-semibold hover:underline"
          >
            {href} &rarr;
          </a>
        )}
        {documents?.length > 0 && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={documents[0].path}
            className="mt-2 inline-block max-w-2/3 text-forest-dark font-semibold hover:underline"
          >
            Förhandsgranska: <span>{documents[0].title}</span> &rarr;
          </a>
        )}
      </div>
    </article>
  );
}
