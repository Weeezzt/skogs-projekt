import InfoSection from "@/features/InfoSection";
import PageSearch from "@/features/search/PageSearch";
import StandardHero from "@/features/StandardHero";
import jaktData from "@/data/jaktData.json";

const ctaButtons = [
  {
    label: "Ladda ner fullständiga regelr (PDF)",
    href: "https://allmskog-ac.nu/wp-content/uploads/2023/06/Beslutade-regler-och-priser-for-jakt-pa-SOA-2023-24.pdf",
    bgColor: "bg-orange",
  },
  {
    label: "Köp jaktkort",
    href: "https://allmskog-ac.nu/jaktkort/",
    bgColor: "bg-forest",
  },
];

const sections = jaktData.map((data) => ({
  title: data.title,
  id: data.id,
  content: Array.isArray(data.content) ? data.content.join("\n") : data.content,
}));

export default function JaktContent() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-5">
      <StandardHero
        title="Jakt i Sorsele Övre Allmänningsskog"
        subtitle="Upplev naturen med ansvar – regler och priser för jaktåret 2024/25"
        imageAlt="scenic image"
        imageSrc="/heromoose.jpg"
        ctaButtons={ctaButtons}
      />
      <PageSearch sections={sections} />
      <div className="w-full flex flex-col items-center mt-10 px-2">
        <InfoSection
          title="Allmänna regler"
          id="allmanna-regler"
          ctaLink={{
            label: "Se lantmäteriets fastighetskarta",
            imageSrc: "JAKTKARTA.png",
          }}
        >
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

        <InfoSection title="Älgjakt" id="algjakt">
          <ul className="list-disc ml-5">
            <li>Älgjakten är utarrenderad till jaktlag med avtal med SÖA.</li>
            <li>Sex jaktområden, arrendeavgift 4:00 kr/ha och år.</li>
            <li>Jakten bedrivs inom älgskötselområdet.</li>
            <li>
              Delägare kan ansöka om plats i jaktlag. Icke-delägare kan anmäla
              intresse till styrelsen.
            </li>
          </ul>
        </InfoSection>

        <InfoSection title="Björnjakt" id="bjornjakt">
          <ul className="list-disc ml-5">
            <li>Björnjakt ingår i älgjaktarrendet.</li>
            <li>
              Delägare som inte ingår i jaktlag kan ansöka om tillstånd för
              björnjakt inom dessa områden.
            </li>
          </ul>
        </InfoSection>

        <InfoSection title="Småviltsjakt" id="smaviltsjakt">
          <ul className="list-disc ml-5">
            <li>Småviltsjakten i område 5 är reserverad för arrendatorn.</li>
            <li>
              <b>Priser för småviltsjaktkort:</b>
              <ul className="list-disc ml-8">
                <li>Delägare: Årskort 100 kr</li>
                <li>Familjemedlem: Årskort 300 kr</li>
                <li>
                  Övriga: 1 dag 250 kr, 3 dagar 500 kr, 7 dagar 800 kr, Säsong
                  1500 kr
                </li>
              </ul>
            </li>
            <li>Köp jaktkort via iJakt och Swish.</li>
          </ul>
        </InfoSection>

        <InfoSection title="Fångstpremier" id="fangstpremier">
          <ul className="list-disc ml-5">
            <li>Fångstpremier för vissa rovdjur:</li>
            <li>Mink: 500 kr, Mård: 500 kr, Räv: 400 kr</li>
            <li>
              Endast delägare kan delta. Djur ska uppvisas på skogskontoret.
            </li>
          </ul>
        </InfoSection>
      </div>
    </div>
  );
}
