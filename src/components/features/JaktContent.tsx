"use client";
import InfoSection from "@/features/InfoSection";
import StandardHero from "@/features/StandardHero";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import UploadRulesDocumentModal from "@/components/modals/UploadRulesDocumentModal";

const FALLBACK_SORSELE =
  "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/Beslutade+regler+och+priser+f%C3%B6r+jakt+p%C3%A5+S%C3%96A+2026-27.pdf";
const FALLBACK_TSA =
  "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/Jakt+o+fiske+priser+och+regler+2026.pdf";

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
  const organisation = params.orgname;
  const router = useRouter();
  const { isLoggedIn, user } = useUserSession();

  const [pdfUrl, setPdfUrl] = useState<string>(
    isSorsele ? FALLBACK_SORSELE : FALLBACK_TSA,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPdfUrl = async () => {
    try {
      const res = await fetch(`/api/${organisation}/document/jakt-regler`);
      if (res.ok) {
        const doc = await res.json();
        if (doc?.path) setPdfUrl(doc.path);
      }
    } catch {
      // keep fallback
    }
  };

  useEffect(() => {
    if (!organisation) return;
    fetchPdfUrl();
  }, [organisation]);

  const ctaButtons = [
    {
      label: "Ladda ner fullständiga regelr (PDF)",
      href: pdfUrl,
      bgColor: "bg-orange",
    },
    {
      label: "Köp jaktkort",
      href: isSorsele
        ? "https://www.ijakt.se/jaktkort-sorsele-ovre-allmanningsskog.htm"
        : "https://www.ijakt.se/jakt-tarna-stensele-allmanningskog.htm",
      bgColor: "bg-forest-dark",
    },
  ];

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
        ctaButtons={ctaButtons}
      />

      <div className="md:hidden mt-4 w-full flex flex-wrap items-center justify-center gap-3 px-2">
        {ctaButtons.map((b, i) => (
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

      {isLoggedIn && user && (
        <div className="w-full flex justify-center px-4 md:px-8">
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm text-beige border border-beige rounded px-3 py-2 hover:border-orange cursor-pointer transition-colors"
          >
            Uppdatera regeldokument
          </button>
        </div>
      )}

      <UploadRulesDocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="jakt"
        onUploaded={fetchPdfUrl}
      />

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
                  : textContentPerOrg.tarnaStensele.jaktKartaImageSrc,
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
