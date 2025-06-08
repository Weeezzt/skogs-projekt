import LayingCard from "@/features/cards/LayingCard";
import StandingCard from "@/features/cards/StandingCard";

export default function Home() {
  return (
    <main>
      <section className="relative flex flex-col items-center justify-center min-h-[45vh] rounded-b-xl shadow-lg overflow-hidden mb-12 bg-gradient-to-br from-orange via-forest to-forest/70">
        <div className="absolute inset-0 bg-gradient-to-tl from-forest/40 via-transparent to-orange/20 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pb-26">
          <h1 className="text-4xl md:text-6xl font-extrabold text-beige drop-shadow-lg text-center mb-4">
            Sorsele övre allmänningskog
          </h1>
          <p className="text-lg md:text-2xl text-beige text-center max-w-2xl">
            Välkommen till vår gemensamma skog – en plats för natur, gemenskap
            och framtid!
          </p>
        </div>
      </section>
      <section className="mx-auto w-full my-[-180px] z-10 relative">
        <div className="flex justify-evenly min-h-[400px] w-full">
          <StandingCard
            title="Jakt"
            id="jakt"
            description="Information om jaktsäsonger, tilldelningar och regler. Ta del av aktuella jakttillfällen och ansök om jakt inom våra marker."
            imageSrc="/jaktbild.jpg"
            href="/jakt"
          />
          <StandingCard
            title="Fiske"
            id="fiske"
            description="Information och regler för fiske."
            imageSrc="/fiskebild.jpg"
            href="/fiske"
          />
          <StandingCard
            title="Kartor"
            id="kartor"
            description="Se våra jaktområden, fiskevatten och viktiga gränser. Interaktiva kartor hjälper dig att planera din vistelse i skogen."
            imageSrc="/karta.png"
            href="/kartor"
          />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 mt-50">
        <h2 className="text-3xl md:text-4xl font-extrabold text-forest mb-8 text-center">
          Senaste Nytt
        </h2>
        <section className="mx-auto  w-full px-4 py-8 flex justify-center gap-20">
          <LayingCard
            id="/nyheter/skog-upphandling"
            href="/nyheter/skog-upphandling"
            imageSrc="/skog.png"
            title="Upphandling av skog utanför Umeå"
            size="large"
            description="Vi söker leverantörer för avverkning och transport av skog utanför Umeå. Är du intresserad av att lämna anbud eller vill veta mer? Kontakta oss för fullständig information och anbudsunderlag."
          ></LayingCard>
          <LayingCard
            id="/nyheter/arsstamma-2025"
            href="/nyheter/arsstamma-2025"
            imageSrc="/skog.png"
            title="Inför Årstämma 2025"
            size="large"
            description="Välkommen till årsstämman 2025! Här får du information om datum, plats och dagordning samt hur du kan delta och påverka beslut för Sorsele övre allmänningskog."
          ></LayingCard>
        </section>
      </div>
    </main>
  );
}
