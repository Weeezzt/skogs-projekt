import StandingCard from "@/features/cards/StandingCard";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-orange via-forest to-forest/90">
      <section className="relative flex flex-col items-center sm:justify-center min-h-[45vh] rounded-b-xl overflow-hidden mb-12 ">
        <div className="relative z-10 flex flex-col items-center sm:justify-center h-full w-full px-4 pb-26">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-beige drop-shadow-lg text-center mb-4">
            Välkommen till Allmänningsskogarna
          </h1>
          <p className="text-lg sm:text-2xl text-beige text-center max-w-2xl">
            {" "}
            Välj vilken allmänningsskog du vill besöka för att få information,
            nyheter och tjänster.
          </p>
        </div>
      </section>
      <section className="mx-auto mb-4 w-full my-[-180px] z-10 relative ">
        <div className="flex flex-col gap-6 md:flex-row items-center justify-evenly min-h-[500px] w-full px-2 0">
          <StandingCard
            title="Sorsele övre allmänningsskog"
            id="jakt"
            description="Allmän information om Sorsele övre allmänningsskog, dess verksamhet och tjänster."
            imageSrc="/jaktbild.jpg"
            href="/sorsele/hem"
          />
          <StandingCard
            title="Tärna-Stensele allmänningsskog"
            id="fiske"
            description="Allmän information om Tärna-Stensele allmänningsskog, dess verksamhet och tjänster."
            imageSrc="/fiskebild.jpg"
            href="/tarna-stensele/hem"
          />
        </div>
      </section>
    </main>
  );
}
