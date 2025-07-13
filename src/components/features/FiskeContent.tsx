import StandardHero from "@/features/StandardHero";
import InfoSection from "@/features/InfoSection";
import PageSearch from "@/features/search/PageSearch";
import fiskeData from "@/data/fiskeData.json";
import ThumbnailSlider from "@/features/sliders/ThumbnailSlider";

const ctaButtons = [
  {
    label: "Ladda ner fullständiga regler (PDF)",
    href: "https://allmskog-ac.nu/wp-content/uploads/2023/06/Beslutade-regler-och-priser-for-jakt-pa-SOA-2023-24.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp fiskekort",
    href: "https://allmskog-ac.nu/fiskekort/",
    bgColor: "bg-forest",
  },
];

// For searchability and simple display
const searchableSections = fiskeData.map((section) => ({
  title: section.title,
  id: section.id,
  content: Array.isArray(section.content)
    ? section.content.join("\n")
    : section.description || "",
}));

interface FishingSection {
  title: string;
  id: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

const fishingSections: FishingSection[] = [
  {
    title: "Gukkis",
    id: "gukkis",
    imageSrc: "/juktån.jpg",
    imageAlt: "Gukkis",
    description:
      "Gukkis är en vacker fjällnära sjö känd för sitt klara vatten och fina öringbestånd. Här är det särskilt populärt att fiska från flytring eller från land.",
  },
  {
    title: "Gipper",
    id: "gipper",
    imageSrc: "/gipper.jpg",
    imageAlt: "Gipper sjö",
    description:
      "Gipper är en stor insjö med varierande djup och många öar. Här finns både öring och röding, och det är populärt att fiska med spinnare eller fluga.",
  },
  {
    title: "Harrträsket",
    id: "harrtrasket",
    imageSrc: "/flugfiske.jpg",
    imageAlt: "Harrträsket sjö",
    description:
      "Harrträsket är en mindre sjö med ett rikt bestånd av harr. Här är det vanligt att fiska med fluga eller lätt spinnfiske. Här fångas årligen harrar över två kilo. Båt och boende finns",
  },
  {
    title: "Snorsen",
    id: "snorsen",
    imageSrc: "/snorsen.jpg",
    imageAlt: "Snorsen sjö",
    description:
      "Snorsen är en populär fiskeplats för både nybörjare och erfarna fiskare. Här finns öring och sik, och det är lätt att komma åt från land. Känd för stora harrar, ofta över två kilo. Boende finns.",
  },
];

export default function FiskeContent() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-5">
      <StandardHero
        title="Fiske i Sorsele Övre Allmänningsskog"
        subtitle="Upplev naturen med förstklassigt fiske i västerbotten – regler och priser för fiskeåret 2024/25"
        imageAlt="scenic image"
        imageSrc="/herotrout.jpg"
        ctaButtons={ctaButtons}
      />
      <PageSearch sections={searchableSections} />

      <div className="w-full flex flex-col items-center mt-10 px-2">
        {fiskeData.map((section) => (
          <InfoSection
            key={section.id}
            title={section.title}
            id={section.id}
            ctaLink={section.ctaLink}
          >
            {section.description && (
              <p className="mb-2">{section.description}</p>
            )}

            {section.title === "Populära sjöar" && (
              <div className="my-6">
                <ThumbnailSlider sections={fishingSections} />
              </div>
            )}
            {Array.isArray(section.content) && (
              <ul className="list-disc ml-5 space-y-1">
                {section.content.map((item, index) =>
                  typeof item === "string" ? (
                    <li key={index}>{item}</li>
                  ) : (
                    <li key={index}>
                      <span className="font-semibold">{item.name}:</span>{" "}
                      {item.fisk?.join(", ")}
                      {item.info && (
                        <div className="text-sm text-gray-600">{item.info}</div>
                      )}
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
