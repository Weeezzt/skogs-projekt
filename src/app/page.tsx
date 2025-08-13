import LayingCard from "@/features/cards/LayingCard";
import StandingCard from "@/features/cards/StandingCard";

export default function Home() {
  return (
    <main>
      <section className="relative flex flex-col items-center justify-center min-h-[45vh] rounded-b-xl shadow-lg overflow-hidden mb-12 bg-gradient-to-br from-orange via-forest to-forest/70">
        <div className="absolute inset-0 bg-gradient-to-tl from-forest/40 via-transparent to-orange/20 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pb-26">
          <h1 className="text-4xl md:text-6xl font-extrabold text-beige drop-shadow-lg text-center mb-4">
            Välkommen till Allmänningskogarna
          </h1>
          <p className="text-lg md:text-2xl text-beige text-center max-w-2xl">
            {" "}
            Välj vilken allmänningsskog du vill besöka för att få information,
            nyheter och tjänster.
          </p>
        </div>
      </section>
      <section className="mx-auto mb-4 w-full my-[-180px] z-10 relative">
        <div className="flex justify-evenly min-h-[400px] w-full">
          <StandingCard
            title="Sorsele övre allmänningsskog"
            id="jakt"
            description="Information och regler för fiske. Information om jaktsäsonger, tilldelningar och regler."
            imageSrc="/jaktbild.jpg"
            href="/sorsele/hem"
          />
          <StandingCard
            title="Tärna-Stensele allmänningsskog"
            id="fiske"
            description="Information och regler för fiske. Information om jaktsäsonger, tilldelningar och regler."
            imageSrc="/fiskebild.jpg"
            href="/tarna-stensele/hem"
          />
        </div>
      </section>
    </main>
  );
}
