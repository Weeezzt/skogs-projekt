import Image from "next/image";

interface StandingCardProps {
  title?: string;
  id: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  children?: React.ReactNode;
}

export default function StandingCard({
  title,
  id,
  description,
  imageSrc,
  imageAlt = "",
  href,
  children,
}: StandingCardProps) {
  const cardContent = (
    <div
      className="flex flex-col items-center bg-forest-dark rounded-lg text-beige/90 border-forest-dark border hover:-translate-y-1 hover:shadow-md overflow-hidden transition-transform w-72 min-h-[380px]"
      id={id}
    >
      {imageSrc && (
        <div className="w-full h-48 relative">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="288px"
            priority
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5 w-full items-center">
        <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
        <p className="text-beige/80 text-center mb-4 flex-1">{description}</p>
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block cursor-pointer">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
