"use client";
import InfoSection from "@/features/InfoSection";
import StandardHero from "@/features/StandardHero";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import UploadRulesDocumentModal from "@/components/modals/UploadRulesDocumentModal";
import { fetchDocumentPath } from "@/lib/fetchDocumentPath";
import { buttonRow, ghostButton } from "@/lib/buttonStyles";
import { ExternalLink, FileSpreadsheet, FileText, Map } from "lucide-react";

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
      // fallback; admins can upload a newer one (tag "omradesansvariga")
      href: "/docs/tarna-stensele/jakt-files/Omradesansvariga_TSA_ASO_2026.pdf",
      meta: "PDF",
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

type UploadTag = "jakt-regler" | "omradesansvariga";

const UPLOAD_LABELS: Record<UploadTag, string> = {
  "jakt-regler": "jaktregler",
  omradesansvariga: "områdesansvariga",
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
  const [omradesUrl, setOmradesUrl] = useState<string>(
    documentsForOrg.tarnaStensele[0].href,
  );
  const [uploadTag, setUploadTag] = useState<UploadTag | null>(null);

  const loadDocument = (tag: UploadTag) => {
    if (!organisation) return;
    fetchDocumentPath(String(organisation), tag).then((path) => {
      if (path) (tag === "jakt-regler" ? setPdfUrl : setOmradesUrl)(path);
    });
  };

  useEffect(() => {
    if (!organisation) return;
    const org = String(organisation);
    fetchDocumentPath(org, "jakt-regler").then((path) => {
      if (path) setPdfUrl(path);
    });
    fetchDocumentPath(org, "omradesansvariga").then((path) => {
      if (path) setOmradesUrl(path);
    });
  }, [organisation]);

  // Johan may upload the list as Excel; show that instead of "PDF"
  const omradesIsExcel = /\.xlsx?$/i.test(omradesUrl);
  const elgDocuments = [
    {
      ...documentsForOrg.tarnaStensele[0],
      href: omradesUrl,
      meta: omradesIsExcel ? "Excel" : "PDF",
      Icon: omradesIsExcel ? FileSpreadsheet : FileText,
    },
    documentsForOrg.tarnaStensele[1],
  ];

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
        <div className={`grid ${buttonRow} mx-auto`}>
          <button
            onClick={() => setUploadTag("jakt-regler")}
            className={ghostButton}
          >
            Uppdatera regeldokument
          </button>
          {!isSorsele && (
            <button
              onClick={() => setUploadTag("omradesansvariga")}
              className={ghostButton}
            >
              Uppdatera områdesansvariga
            </button>
          )}
        </div>
      )}

      {uploadTag && (
        <UploadRulesDocumentModal
          isOpen
          onClose={() => setUploadTag(null)}
          tag={uploadTag}
          label={UPLOAD_LABELS[uploadTag]}
          allowExcel={uploadTag === "omradesansvariga"}
          onUploaded={() => loadDocument(uploadTag)}
        />
      )}

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
                  href={omradesUrl}
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
                {elgDocuments.map(
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
                            {meta} ·{" "}
                            {meta === "Excel" ? "laddas ned" : "öppnas i ny flik"}
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
