"use client";
import Link from "next/link";

const navLinks = [
  { href: "/nyheter", label: "Nyheter" },
  { href: "/jakt-fiske", label: "Jakt & Fiske" },
  { href: "/dokument", label: "Dokument" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2F5D50] text-beige pt-10 pb-4 mt-20 w-full">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Logo and trademark */}
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <span className="text-3xl font-bold text-orange mb-2">SÖA</span>
          <span className="text-xs text-beige/70">
            &copy; {new Date().getFullYear()} Sorsele övre allmänningskog
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-orange text-[#2F5D50] px-4 py-2 cursor-pointer rounded-md font-semibold shadow hover:bg-orange/80 transition"
        >
          Till toppen
        </button>
      </div>
    </footer>
  );
}
