import { DocumentDTO } from "@/types/dtos";
import Image from "next/image";
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
  documents: DocumentDTO[]; // Optional, if you want to link to a document
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
  documents, // Optional, if you want to link to a document
}: NewsCardProps) {
  const router = useRouter();
  const path = usePathname();
  const onClickCard = () => {
    const match = path.match(/^\/([^/]+)/);
    const orgname = match ? match[1] : "";
    if (orgname && id) {
      router.push(`/${orgname}/nyheter/${id}`);
    }
  };
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
  return (
    <div
      className="flex flex-col lg:flex-row bg-beige rounded-xl shadow-lg overflow-hidden w-full cursor-pointer"
      id={id.toString()}
      onClick={onClickCard}
    >
      {imageSrc && (
        <div className="w-full relative aspect-[16/9] lg:w-64 lg:aspect-auto lg:h-auto flex-shrink-0">
          <Image
            src={imageSrc}
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
      )}
      <div className="flex flex-col flex-1 p-4 justify-center">
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-gray-700 mb-2">{description}</p>
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
            className="mt-2 inline-block text-orange font-semibold hover:underline"
          >
            Läs mer &rarr;
          </a>
        )}
        {documents?.length > 0 && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/docs/${documents[0].path}`}
            className="mt-2 inline-block text-forest font-semibold hover:underline"
          >
            Förhandsgranska: <span>{documents[0].title}</span> &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
