import StandardHero from "@/features/StandardHero";
import InfoSection from "@/features/InfoSection";
import PageSearch from "@/features/search/PageSearch";
import fiskeData from "@/data/fiskeData.json";
import { useParams } from "next/navigation";

const ctaButtonsSorsele = [
  {
    label: "Ladda ner fullständiga regler (PDF)",
    href: "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/d58d7c2c-6de5-4688-af66-56758f04e2da_Jakt-o-fiske-priser-och-regler-2025.pdfhttps://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/6402d892-253a-483f-9617-73b7d5411431_Beslutade-regler-och-priser-for-jakt-pa-SOA-2023-24.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp fiskekort",
    href: "https://www.ifiske.se/fiske-sorsele-ovre-allmanningsskog.htm.se",
    bgColor: "bg-forest",
  },
];

const ctaButtonsTSA = [
  {
    label: "Ladda ner fullständiga regler (PDF)",
    href: "https://allmskog-ac.s3.eu-north-1.amazonaws.com/uploads/sorsele/files/Jakt+%26+Fiske/d58d7c2c-6de5-4688-af66-56758f04e2da_Jakt-o-fiske-priser-och-regler-2025.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp fiskekort",
    href: "https://www.ifiske.se/fiske-storumansjon-umnassjon-girjesan-m-fl-vatten.htm",
    bgColor: "bg-forest",
  },
];

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
        ctaButtons={isSorsele ? ctaButtonsSorsele : ctaButtonsTSA}
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
                  )
                )}
              </ul>
            )}
          </InfoSection>
        ))}
      </div>
    </div>
  );
}
