"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const organizations = [
  { label: "Sorsele", slug: "sorsele" },
  { label: "Tärna-Stensele", slug: "tarna-stensele" },
] as const;

type OrgSlug = (typeof organizations)[number]["slug"];

const ORG_INFO: Record<
  OrgSlug,
  {
    brand: string;
    email?: string;
    phone?: string;
    address?: string;
  }
> = {
  sorsele: {
    brand: "SÖA",
    email: "info@sorsele.example.se",
    phone: "+46 (0)xx-xxx xx xx",
    address: "Adressrad, 924 xx Sorsele",
  },
  "tarna-stensele": {
    brand: "TSA",
    email: "info@tarna-stensele.example.se",
    phone: "+46 (0)yy-yyy yy yy",
    address: "Adressrad, 920 xx Tärnaby",
  },
};

function getActiveOrg(pathname: string): OrgSlug | null {
  const first = pathname.split("/")[1];
  return organizations.some((o) => o.slug === first)
    ? (first as OrgSlug)
    : null;
}

function buildOrgUrl(org: OrgSlug | null, href: string) {
  if (!org) return href; // fallback (e.g., landing pages without org prefix)
  return `/${org}${href}`;
}

export default function Footer() {
  const pathname = usePathname();
  const activeOrg = useMemo(() => getActiveOrg(pathname), [pathname]);
  const orgInfo = activeOrg ? ORG_INFO[activeOrg] : ORG_INFO["sorsele"]; // sensible default

  return (
    <footer className="mt-auto bg-forest text-beige w-full">
      {/* Top content */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div
          className="grid grid-cols-1 gap-10 sm:grid-cols-3
             lg:grid-cols-3 text-center sm:text-left"
        >
          {/* Brand + Org Switch */}
          <div className="text-center sm:text-left">
            <div className="text-2xl font-extrabold text-orange tracking-tight">
              {orgInfo.brand}
            </div>
            <p className="mt-3 text-sm text-beige/80">
              {activeOrg === "tarna-stensele"
                ? "Tärna-Stensele Allmänningsskog – information, dokument, jakt & fiske."
                : "Sorsele övre allmänningsskog – information, dokument, jakt & fiske."}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/5 p-1">
              {organizations.map((org) => {
                const isActive = org.slug === activeOrg;
                const href =
                  activeOrg && pathname.startsWith(`/${activeOrg}`)
                    ? pathname.replace(`/${activeOrg}`, `/${org.slug}`)
                    : `/${org.slug}/hem`;
                return (
                  <Link
                    key={org.slug}
                    href={href}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      isActive
                        ? "bg-orange text-[#2F5D50] font-semibold"
                        : "hover:text-orange"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {org.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact (org-specific) */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-beige/90">
              Kontakt
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-beige/80">
              {orgInfo.email && (
                <li>
                  <a
                    className="hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70 rounded"
                    href={`mailto:${orgInfo.email}`}
                  >
                    {orgInfo.email}
                  </a>
                </li>
              )}
              {orgInfo.phone && (
                <li>
                  <a
                    className="hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70 rounded"
                    href={`tel:${orgInfo.phone.replace(/\s+/g, "")}`}
                  >
                    {orgInfo.phone}
                  </a>
                </li>
              )}
              {orgInfo.address && <li>{orgInfo.address}</li>}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/15 px-4 py-2 ml-auto rounded-md font-medium hover:cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/70"
              aria-label="Till toppen"
            >
              Till toppen
            </button>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-beige/70">
          <p className="text-center">
            © {new Date().getFullYear()}{" "}
            {activeOrg === "tarna-stensele"
              ? "Tärna-Stensele Allmänningsskog"
              : "Sorsele övre allmänningsskog"}
            . Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
