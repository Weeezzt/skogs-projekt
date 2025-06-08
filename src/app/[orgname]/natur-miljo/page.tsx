"use client";

export default function NaturMiljoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Natur & Miljö</h1>

      <section className="space-y-5 text-lg leading-relaxed">
        <p>
          Skogen i Sorsele Övre Allmänningsskog rymmer stora naturvärden och är
          hem för en rik biologisk mångfald. Vi arbetar aktivt med att bevara
          och utveckla dessa värden genom ett ansvarsfullt och långsiktigt
          skogsbruk.
        </p>

        <p>
          Skogsskötseln sker med hänsyn till naturmiljön. Det innebär bland
          annat att nyckelbiotoper sparas, skyddszoner längs vattendrag bevaras
          och äldre träd lämnas för att gynna biodiversiteten.
        </p>

        <p>
          Området innehåller även formellt skyddade naturreservat och frivilligt
          avsatta områden som inte brukas. Vi följer noggrant de föreskrifter
          som gäller för dessa marker.
        </p>

        <p>
          All skogsförvaltning är certifierad enligt <strong>PEFC™</strong> och
          därmed förenlig med internationella krav på ett hållbart och
          miljövänligt skogsbruk.
        </p>
      </section>

      <section className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Ett ansvar för framtiden
        </h2>
        <p>
          Vi tror på ett skogsbruk där både ekosystem och människor kan leva i
          balans. Genom att kombinera ekonomisk nytta med ekologiskt ansvar kan
          vi lämna ett hållbart arv till kommande generationer.
        </p>
        <a
          href="https://www.pefc.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-orange-700 hover:text-orange-900 underline transition-colors"
        >
          Läs mer om PEFC och hållbart skogsbruk
        </a>
      </section>
    </main>
  );
}
