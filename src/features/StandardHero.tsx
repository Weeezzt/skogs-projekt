import Image from "next/image";

interface StandardHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  ctaButtons?: {
    label: string;
    href: string;
    bgColor: string;
  }[];
}

// Shared page header: photo, dark gradient, text bottom-left
export default function StandardHero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  ctaButtons,
}: StandardHeroProps) {
  return (
    <section className="relative w-full rounded-xl overflow-hidden shadow-lg mb-8 flex min-h-48 sm:min-h-56 md:min-h-64 lg:min-h-72 items-end">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover brightness-95 contrast-110"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
      <div className="relative w-full p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-beige drop-shadow">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-beige/90 md:text-lg drop-shadow">
            {subtitle}
          </p>
        )}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {ctaButtons.map((button) => {
              const external = button.href.startsWith("http");
              return (
                <a
                  key={button.label}
                  href={button.href}
                  className={`px-4 py-2 rounded-lg text-sm md:text-base shadow-md border border-transparent hover:border-beige transition-colors ${button.bgColor}`}
                  rel={external ? "noopener noreferrer" : undefined}
                  target={external ? "_blank" : undefined}
                >
                  {button.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
