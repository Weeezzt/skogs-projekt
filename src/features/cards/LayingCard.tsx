import Image from "next/image";

interface LayingCardProps {
  title?: string;
  id: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
}

const sizeClasses = {
  small: "h-32 w-full md:w-72",
  medium: "h-40 w-full md:w-[420px]",
  large: "h-56 w-full md:w-[600px]",
};

export default function LayingCard({
  title,
  id,
  description,
  imageSrc,
  imageAlt = "",
  href,
  size = "medium",
  children,
}: LayingCardProps) {
  const cardContent = (
    <div
      className={`flex bg-orange/10 rounded-xl shadow-lg overflow-hidden transition-transform border-2 border-transparent hover:border-orange hover:shadow-2xl ${sizeClasses[size]}`}
      id={id}
    >
      {imageSrc && (
        <div className="relative flex-shrink-0 h-full w-1/3 min-w-[100px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
            priority
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5 justify-center">
        <h3 className="text-lg md:text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
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
