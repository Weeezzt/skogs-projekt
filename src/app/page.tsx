import StandingCard from "@/features/cards/StandingCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-forest min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-[30vh] rounded-b-xl overflow-hidden mb-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-beige drop-shadow-lg mb-4">
          Välkommen till Allmänningsskogarna
        </h1>
        <p className="text-lg sm:text-2xl text-beige/90 max-w-2xl">
          Välj vilken allmänningsskog du vill besöka för att få information,
          nyheter och tjänster.
        </p>
      </section>

      {/* ORG SELECT GRID */}
      <section className="container mx-auto max-w-7xl px-4 mt-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SORSELE */}
          <Link
            href="/sorsele/hem"
            className="group block rounded-xl overflow-hidden relative border-2 border-transparent hover:border-orange transition-all duration-300"
          >
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            {/* image */}
            <img
              src="/alg-med-hund-krona.jpg"
              alt="En höstskog med älg i norra Sverige."
              className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
            />
            {/* text overlay */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-20">
              <h3 className="text-white text-2xl sm:text-3xl font-serif font-bold">
                Sorsele Övre Allmänningsskog
              </h3>
              <p className="text-beige/90 mt-2 text-sm sm:text-base max-w-md">
                Upptäck våra rika jaktmarker och fiskevatten i en storslagen
                miljö.
              </p>
            </div>
          </Link>

          {/* TARNA-STENSELE */}
          <Link
            href="/tarna-stensele/hem"
            className="group block rounded-xl overflow-hidden relative border-2 border-transparent hover:border-orange transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src="/stavar.jpg"
              alt="Ett lugnt vinterlandskap med snötäckta tallar och frusna sjöar."
              className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-20">
              <h3 className="text-white text-2xl sm:text-3xl font-serif font-bold">
                Tärna-Stensele Allmänningsskog
              </h3>
              <p className="text-beige/90 mt-2 text-sm sm:text-base max-w-md">
                Utforska vinterlandskapet och de orörda vidderna i fjällnära
                skog.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
