import InfoSection from "@/features/InfoSection";
import StandardHero from "@/features/StandardHero";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
const ctaButtonsSorsele = [
  {
    label: "Ladda ner fullständiga regelr (PDF)",
    href: "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt%20och%20Fiske/5fc13b2f-1dc5-44dc-b0ff-1ce7921ad3c9_Beslutade%20regler%20och%20priser%20f%C3%B6r%20jakt%20p%C3%A5%20S%C3%96A%202025-26.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp jaktkort",
    href: "https://www.ijakt.se/jaktkort-sorsele-ovre-allmanningsskog.htm",
    bgColor: "bg-forest-dark",
  },
];

const ctaButtonsTSA = [
  {
    label: "Ladda ner fullständiga regelr (PDF)",
    href: "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/d58d7c2c-6de5-4688-af66-56758f04e2da_Jakt-o-fiske-priser-och-regler-2025.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp jaktkort",
    href: "https://www.ijakt.se/jakt-tarna-stensele-allmanningskog.htm",
    bgColor: "bg-forest-dark",
  },
];
const textContentPerOrg = {
  sorsele: {
    title: "Jakt i Sorsele Övre Allmänningsskog",
    subtitle:
      "Upplev naturen med ansvar – regler och priser för jaktåret 2025/2026",
    imageSrc: "/heromoose.jpg",
    imageAlt: "scenic image",
    jaktKartaImageSrc: "/JAKTKARTA.png",
  },
  tarnaStensele: {
    title: "Jakt i Tärna-Stensele Allmänningsskog",
    subtitle:
      "Upplev naturen med ansvar – regler och priser för jaktåret 2025/26",
    imageSrc: "/heromoose.jpg",
    imageAlt: "scenic image",
    jaktKartaImageSrc: "/Enkel-oversiktskarta-TSA-jakt.jpg",
  },
};
const documentsForOrg = {
  sorsele: [
    {
      title: "Jakt- och fiskeregler 2024/25",
      href: "/docs/sorsele/jakt-files/Jakt-o-fiske-priser-och-regler-2025.pdf",
    },
    {
      title: "Jaktkarta Sorsele Övre Allmänningsskog",
      href: "/docs/sorsele/jakt-files/Jaktkarta-SOA.pdf",
    },
  ],
  tarnaStensele: [
    {
      title: "Områdesansvariga",
      href: "/docs/tarna-stensele/jakt-files/Omradesansvariga_TSA_ASO_2024.pdf",
    },
    {
      title: "Fördjupad inskannad karta över älgjaktsområden",
      href: "/docs/tarna-stensele/jakt-files/karta-tsa-algjaktsomraden.pdf",
    },
    {
      title: "JAKTKARTA Tärna-Stensele Allmänningsskog",
      href: "/docs/tarna-stensele/jakt-files/TSA-jakt-o-fiskekarta-hela-allm-16-01-14-v4-52x52-1.pdf",
    },
  ],
};

export default function JaktContent() {
  const params = useParams();
  const isSorsele = params.orgname === "sorsele";
  const router = useRouter();
  const handleOpenMapImage = (src: string) => {
    router.push(src);
  };
  return (
    <div className="px-2 flex flex-col gap-4 items-center justify-center mt-5">
      <StandardHero
        title={
          isSorsele
            ? textContentPerOrg.sorsele.title
            : textContentPerOrg.tarnaStensele.title
        }
        subtitle={
          isSorsele
            ? textContentPerOrg.sorsele.subtitle
            : textContentPerOrg.tarnaStensele.subtitle
        }
        imageAlt="scenic image"
        imageSrc="/heromoose.jpg"
        ctaButtons={isSorsele ? ctaButtonsSorsele : ctaButtonsTSA}
      />
      <div className="md:hidden mt-4 w-full flex flex-wrap items-center justify-center gap-3 px-2">
        {(isSorsele ? ctaButtonsSorsele : ctaButtonsTSA).map((b, i) => (
          <a
            key={i}
            href={b.href}
            className={`mx-8 w-full sm:w-2/3 text-center py-2 rounded-lg text-white ${b.bgColor} shadow-md text-sm`}
            rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined}
            target={b.href.startsWith("http") ? "_blank" : undefined}
          >
            {b.label}
          </a>
        ))}
      </div>
      <div className=" w-full flex flex-col items-center mt-10 px-2">
        <InfoSection title="Allmänna regler" id="allmanna-regler">
          <ul className="list-disc ml-5">
            <li>
              Kontrollera alltid att du har jakträtt inom aktuellt område.
            </li>
            <li>
              Observera att det finns privatägda ströängar inom
              allmänningsskogen.
            </li>
            <li>Se detaljerad information på Lantmäteriets fastighetskarta.</li>
          </ul>
        </InfoSection>
        <div className="w-full flex flex-col items-center my-10 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-forest font-bold">
            Jakt- och fiskekarta
          </h2>
          <Image
            src={
              isSorsele
                ? textContentPerOrg.sorsele.jaktKartaImageSrc
                : textContentPerOrg.tarnaStensele.jaktKartaImageSrc
            }
            alt="Jakttilldelning"
            width={960}
            height={600}
            className="mt-6 w-full max-w-3xl rounded-xl shadow-lg cursor-zoom-in"
            onClick={() =>
              handleOpenMapImage(
                isSorsele
                  ? textContentPerOrg.sorsele.jaktKartaImageSrc
                  : textContentPerOrg.tarnaStensele.jaktKartaImageSrc
              )
            }
            priority
          />
          {!isSorsele && (
            <>
              <a
                href={documentsForOrg.tarnaStensele[1].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center mt-8 p-2 rounded-lg text-lg md:text-xl inline-block md:max-w-3xl text-forest font-semibold hover:border-orange border-forest border-2"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                  }
                }}
              >
                {documentsForOrg.tarnaStensele[1].title}
              </a>

              <a
                href={documentsForOrg.tarnaStensele[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center mt-4 p-2 rounded-lg text-lg md:text-xl inline-block md:max-w-3xl text-forest font-semibold hover:border-orange border-forest border-2"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                  }
                }}
              >
                {documentsForOrg.tarnaStensele[0].title}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
