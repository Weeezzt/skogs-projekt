"use client";
import InfoSection from "@/features/InfoSection";
import StandardHero from "@/features/StandardHero";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import UploadRulesDocumentModal from "@/components/modals/UploadRulesDocumentModal";
import { fetchRulesPath } from "@/lib/fetchRulesPath";
import { ExternalLink, FileText, Map } from "lucide-react";

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
      title: "Områdesansvariga per älgjaktsområde",
      href: "/docs/tarna-stensele/jakt-files/Omradesansvariga_TSA_ASO_2024.pdf",
      meta: "PDF · 131 kB",
      Icon: FileText,
    },
    {
      title: "Fördjupad inskannad karta över älgjaktsområden",
      href: "/docs/tarna-stensele/jakt-files/karta-tsa-algjaktsomraden.pdf",
      meta: "PDF · 7,1 MB",
      Icon: Map,
    },
    {
      title: "JAKTKARTA Tärna-Stensele Allmänningsskog",
      href: "/docs/tarna-stensele/jakt-files/TSA-jakt-o-fiskekarta-hela-allm-16-01-14-v4-52x52-1.pdf",
      meta: "PDF · 12 MB",
      Icon: Map,
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

  const loadPdfUrl = () => {
    if (!organisation) return;
    fetchRulesPath(String(organisation), "jakt-regler").then((path) => {
      if (path) setPdfUrl(path);
    });
  };

  useEffect(() => {
    if (!organisation) return;
    fetchRulesPath(String(organisation), "jakt-regler").then((path) => {
      if (path) setPdfUrl(path);
    });
  }, [organisation]);

  const ctaButtons = [
    {
      label: "Ladda ner fullständiga regler (PDF)",
      href: pdfUrl,
      bgColor: "bg-orange text-forest font-semibold",
    },
    {
      label: "Köp jaktkort",
      href: isSorsele
        ? "https://www.ijakt.se/jaktkort-sorsele-ovre-allmanningsskog.htm"
        : "https://www.ijakt.se/jakt-tarna-stensele-allmanningskog.htm",
      bgColor: "bg-forest-dark text-beige",
    },
  ];

  const handleOpenMapImage = (src: string) => {
    router.push(src);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
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
        imageAlt=""
        imageSrc="/heromoose.jpg"
        ctaButtons={ctaButtons}
      />


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
        onUploaded={loadPdfUrl}
      />

      <div className="w-full flex flex-col items-center">
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
            {!isSorsele && (
              <li>
                Vi vill påminna alla småviltjägare om att kontakta{" "}
                <a
                  href={documentsForOrg.tarnaStensele[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange font-semibold hover:underline"
                >
                  områdesansvarig
                </a>{" "}
                innan jakt. Detta för att stämma av så att småviltjakten inte
                krockar med pågående älgjakt.
              </li>
            )}
          </ul>
        </InfoSection>
        <div className="w-full flex flex-col items-center my-10 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-beige font-bold">
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
          />
          {!isSorsele && (
            <section className="mt-10 w-full md:max-w-3xl">
              <h3 className="mb-3 text-xl font-semibold text-beige">
                Dokument för älgjakt
              </h3>
              <ul className="flex flex-col gap-3">
                {documentsForOrg.tarnaStensele.slice(0, 2).map(
                  ({ href, title, meta, Icon }) => (
                    <li key={href}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 rounded-lg border border-beige/20 bg-forest-dark p-4 text-beige transition-colors hover:border-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                      >
                        <Icon className="h-7 w-7 shrink-0 text-orange" aria-hidden />
                        <span className="flex-1">
                          <span className="block font-semibold md:text-lg">
                            {title}
                          </span>
                          <span className="block text-sm text-beige/60">
                            {meta} · öppnas i ny flik
                          </span>
                        </span>
                        <ExternalLink
                          className="h-5 w-5 shrink-0 text-beige/50 transition-colors group-hover:text-orange"
                          aria-hidden
                        />
                      </a>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
