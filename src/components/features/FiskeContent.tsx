"use client";
import StandardHero from "@/features/StandardHero";
import InfoSection from "@/features/InfoSection";
import PageSearch from "@/features/search/PageSearch";
import fiskeData from "@/data/fiskeData.json";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import UploadRulesDocumentModal from "@/components/modals/UploadRulesDocumentModal";

const FALLBACK_SORSELE =
  "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/Beslutade+regler+och+priser+f%C3%B6r+fiske+inom+S%C3%96A+2022.pdf";
const FALLBACK_TSA =
  "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/Jakt+o+fiske+priser+och+regler+2026.pdf";

const textContentPerOrg = {
  sorsele: {
    title: "Fiske i Sorsele Övre Allmänningsskog",
    subtitle:
      "Upplev naturen med förstklassigt fiske i västerbotten – regler och priser för fiskeåret 2025/2026",
    imageSrc: "/herotrout.jpg",
    imageAlt: "scenic image",
  },
  tarnaStensele: {
    title: "Fiske i Tärna-Stensele Allmänningsskog",
    subtitle:
      "Upplev naturen med förstklassigt fiske i västerbotten – regler och priser för fiskeåret 2025/2026",
    imageSrc: "/herotrout.jpg",
    imageAlt: "scenic image",
  },
};

export default function FiskeContent() {
  const organisation = useParams().orgname;
  const isSorsele = organisation === "sorsele";
  const orgKey = isSorsele ? "sorsele" : "tarnaStensele";
  const orgFiskeData = fiskeData[orgKey] || [];
  const { isLoggedIn, user } = useUserSession();

  const [pdfUrl, setPdfUrl] = useState<string>(
    isSorsele ? FALLBACK_SORSELE : FALLBACK_TSA,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPdfUrl = async () => {
    try {
      const res = await fetch(`/api/${organisation}/document/fiske-regler`);
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
      label: "Ladda ner fullständiga regler (PDF)",
      href: pdfUrl,
      bgColor: "bg-orange",
    },
    {
      label: "Köp fiskekort",
      href: isSorsele
        ? "https://www.ifiske.se/fiske-sorsele-ovre-allmanningsskog.htm.se"
        : "https://www.ifiske.se/fiske-storumansjon-umnassjon-girjesan-m-fl-vatten.htm",
      bgColor: "bg-forest",
    },
  ];

  const searchableSections = orgFiskeData.map((section) => ({
    title: section.title,
    id: section.id,
    content: Array.isArray(section.content)
      ? section.content.join("\n")
      : section.description || "",
  }));

  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-5">
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
        imageSrc="/herotrout.jpg"
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
        type="fiske"
        onUploaded={fetchPdfUrl}
      />

      <PageSearch sections={searchableSections} />

      <div className="w-full flex flex-col items-center mt-10 px-2">
        {fiskeData[orgKey].map((section) => (
          <InfoSection
            key={section.id}
            title={section.title}
            id={section.id}
            ctaLink={section.ctaLink}
          >
            {section.description && (
              <p className="mb-2">{section.description}</p>
            )}
            {Array.isArray(section.content) && (
              <ul className="list-disc ml-5 space-y-1">
                {section.content.map((item, index) =>
                  typeof item === "string" ? (
                    <li key={index}>{item}</li>
                  ) : (
                    <li key={index}>
                      <span className="font-semibold">{item.fisk}: </span>
                      förekomst: {item.förekomst}
                    </li>
                  ),
                )}
              </ul>
            )}
          </InfoSection>
        ))}
      </div>
    </div>
  );
}
