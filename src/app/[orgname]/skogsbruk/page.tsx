"use client";

export default function SkogsbrukPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Skogsbruk</h1>

      <section className="space-y-4 leading-relaxed text-lg">
        <p>
          Tärna-Stensele Allmänningsskog bedriver ett aktivt och hållbart
          skogsbruk som syftar till långsiktig produktion av virkesråvara,
          samtidigt som naturvärden och andra intressen beaktas.
        </p>

        <p>
          Skogsbruket styrs av aktuella skogsbruksplaner och sker med hänsyn
          till ekologiska, sociala och ekonomiska aspekter. Förvaltningen är
          certifierad enligt <strong>PEFC™</strong>, vilket innebär att
          skogsbruket bedrivs ansvarsfullt enligt internationella riktlinjer.
        </p>

        <p>
          Ambitionen är att skapa en balans mellan virkesproduktion, biologisk
          mångfald och rekreationsvärden – något som gagnar både dagens och
          framtidens intressenter.
        </p>
      </section>

      <section className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Certifiering
        </h2>
        <p>
          Tärna-Stensele Allmänningsskog är certifierad enligt PEFC™ – ett
          internationellt system för certifiering av uthålligt skogsbruk.
        </p>
        <a
          href="https://www.pefc.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-orange-700 hover:text-orange-900 underline transition-colors"
        >
          Läs mer om PEFC-certifiering
        </a>
      </section>
    </main>
  );
}
