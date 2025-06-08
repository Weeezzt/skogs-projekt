import Image from "next/image";

//StandardHeroComponent that displays a hero section with a title, subtitle, and an image and three call to action buttons
interface StandardHeroProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaButtons?: {
    label: string;
    href: string;
    bgColor: string;
  }[];
}

export default function StandardHero(props: StandardHeroProps) {
  const { title, subtitle, imageSrc, imageAlt, ctaButtons } = props;

  return (
    <div
      className="bg-beige rounded-xl shadow-lg overflow-hidden p-6 w-full md:w-[600px] lg:w-[800px] xl:w-[1000px] text-center h-[300px] xl:h-[400px] relative"
      style={{
        backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label={imageAlt || "Hero image"}
    >
      {title && <h1 className="text-4xl font-bold mb-2 text-beige">{title}</h1>}
      {subtitle && <p className="text-xl text-beige mb-4">{subtitle}</p>}
      <div className="flex gap-4 justify-center mx-auto mt-60">
        {ctaButtons?.map((button, index) => (
          <a
            key={index}
            href={button.href}
            className={`px-4 py-2 rounded-lg text-white ${button.bgColor} border border-transparent shadow-md hover:border-white `}
            aria-label={button.label}
            rel={
              button.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            target={button.href.startsWith("http") ? "_blank" : undefined}
          >
            {button.label}
          </a>
        ))}
      </div>
    </div>
  );
}
