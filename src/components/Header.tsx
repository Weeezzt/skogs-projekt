"use client";
import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useUserSession } from "@/hooks/useUserSession";
import LoginModal from "./LoginModal";

// --- Config ---
const ORGS = [
  { label: "Sorsele Övre Allmänning", short: "Sorsele", slug: "sorsele" },
  {
    label: "Tärna-Stensele Allmänning",
    short: "Tärna-Stensele",
    slug: "tarna-stensele",
  },
] as const;

const NAV_LINKS = [
  { href: "/hem", label: "Hem" },
  { href: "/dokument", label: "Dokument" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/jakt-fiske", label: "Jakt & Fiske" },
  { href: "/skogsbruk", label: "Skogsbruk" },
  { href: "/natur-miljo", label: "Natur & Miljö" },
  { href: "/styrelse-medlemmar", label: "Styrelse & Medlemmar" },
] as const;

function buildOrgUrl(orgSlug: string, href: string) {
  return `/${orgSlug}${href}`;
}

function useOnClickOutside<T extends HTMLElement | null>(
  ref: React.RefObject<T>,
  cb: () => void
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

function MoreMenu({
  items,
  orgSlug,
  label = "Mer",
}: {
  items: { href: string; label: string }[];
  orgSlug: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(boxRef, () => setOpen(false));

  if (!items.length) return null;

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="whitespace-nowrap text-sm font-medium text-beige/80 hover:text-beige px-2 py-1 rounded transition-colors"
      >
        {label} ▾
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-40 rounded-xl border border-white/10 bg-forest/95 backdrop-blur p-1 shadow-lg z-50"
        >
          {items.map((l) => (
            <Link
              role="menuitem"
              key={l.href}
              href={buildOrgUrl(orgSlug, l.href)}
              className="block px-3 py-2 text-sm text-beige/80 hover:text-beige hover:bg-white/5 rounded-lg whitespace-nowrap"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const { isLoggedIn } = useUserSession();

  const [org, setOrg] = useState<string>(ORGS[0].slug);
  const [navOpen, setNavOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // desktop org indicator
  const desktopOrgWrapRef = useRef<HTMLDivElement | null>(null);
  const orgButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const mobileOrgWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileOrgButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [mobileIndicator, setMobileIndicator] = useState({ left: 0, width: 0 });

  // derive org from path
  useEffect(() => {
    const seg = pathname.split("/")[1];
    if (seg && ORGS.some((o) => o.slug === seg)) setOrg(seg);
  }, [pathname]);

  const activeOrg = useMemo(
    () => ORGS.find((o) => o.slug === org) ?? ORGS[0],
    [org]
  );

  const isActiveLink = (href: string) => {
    const full = buildOrgUrl(activeOrg.slug, href);
    return pathname.startsWith(full);
  };

  // indicator measure (desktop)
  const updateDesktopIndicator = () => {
    const wrap = desktopOrgWrapRef.current;
    if (!wrap) return setIndicator({ left: 0, width: 0 });
    const activeIndex = ORGS.findIndex((o) => o.slug === org);
    const btn = orgButtonRefs.current[activeIndex];
    if (!btn) return setIndicator({ left: 0, width: 0 });
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - wrapRect.left,
      width: btnRect.width,
    });
  };

  const updateMobileIndicator = () => {
    const wrap = mobileOrgWrapRef.current;
    if (!wrap) return setMobileIndicator({ left: 0, width: 0 });
    const activeIndex = ORGS.findIndex((o) => o.slug === org);
    const btn = mobileOrgButtonRefs.current[activeIndex];
    if (!btn) return setMobileIndicator({ left: 0, width: 0 });
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setMobileIndicator({
      left: btnRect.left - wrapRect.left,
      width: btnRect.width,
    });
  };

  useLayoutEffect(() => {
    updateDesktopIndicator();
    updateMobileIndicator();
    const ro = new ResizeObserver(() => {
      updateDesktopIndicator();
      updateMobileIndicator();
    });
    if (desktopOrgWrapRef.current) ro.observe(desktopOrgWrapRef.current);
    if (mobileOrgWrapRef.current) ro.observe(mobileOrgWrapRef.current);
    window.addEventListener("resize", updateDesktopIndicator);
    window.addEventListener("resize", updateMobileIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDesktopIndicator);
      window.removeEventListener("resize", updateMobileIndicator);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  useEffect(() => {
    if (navOpen) {
      // run on next paint to ensure DOM is present
      requestAnimationFrame(() => {
        updateMobileIndicator();
      });
    }
  }, [navOpen]);

  // choose which links to show based on breakpoint via CSS:
  // md: 3 links + More
  // lg: 5 links + More
  // xl: all links
  const mdPrimary = NAV_LINKS.slice(0, 3);
  const mdOverflow = NAV_LINKS.slice(3);
  const lgPrimary = NAV_LINKS.slice(0, 5);
  const lgOverflow = NAV_LINKS.slice(5);

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-50 bg-forest border-b border-black/10"
        aria-label="Huvudmeny"
      >
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          {/* Left: Brand */}
          <a href="/" className="md:hidden lg:block">
            <h3 className=" text-2xl font-bold text-orange text-left select-none cursor-pointer">
              Allmänningen
            </h3>
          </a>

          {/* Center-left: Org switch (desktop only) */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={desktopOrgWrapRef}>
              <span
                aria-hidden
                className="absolute left-0 top-1 bottom-1 rounded-md bg-orange transition-all duration-300"
                style={{
                  transform: `translateX(${indicator.left}px)`,
                  width: `${indicator.width}px`,
                }}
              />
              <div className="relative flex items-center gap-2 rounded-md border border-black/10 bg-white/10 p-2">
                {ORGS.map((o, i) => (
                  <button
                    key={o.slug}
                    type="button"
                    ref={(el) => {
                      orgButtonRefs.current[i] = el;
                    }}
                    onClick={() => setOrg(o.slug)}
                    aria-pressed={org === o.slug}
                    className={
                      "relative z-10 cursor-pointer rounded px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors " +
                      (org === o.slug
                        ? "text-forest"
                        : "hover:bg-black/10 text-beige")
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Primary Nav */}
          <nav
            className="hidden md:flex items-center gap-3 xl:gap-6"
            aria-label="Primär navigation"
          >
            {/* md layout */}
            <div className="flex items-center gap-3 xl:hidden">
              {mdPrimary.map((link) => (
                <Link
                  key={link.href}
                  href={buildOrgUrl(activeOrg.slug, link.href)}
                  className={
                    "text-sm font-medium whitespace-nowrap transition-colors " +
                    (isActiveLink(link.href)
                      ? "text-beige"
                      : "text-beige/90 hover:text-beige")
                  }
                >
                  {link.label}
                </Link>
              ))}
              <MoreMenu items={mdOverflow} orgSlug={activeOrg.slug} />
            </div>

            {/* lg layout overrides md (more links) */}
            <div className="hidden xl:flex 2xl:hidden items-center gap-3">
              {lgPrimary.map((link) => (
                <Link
                  key={link.href}
                  href={buildOrgUrl(activeOrg.slug, link.href)}
                  className={
                    "text-sm font-medium whitespace-nowrap transition-colors " +
                    (isActiveLink(link.href)
                      ? "text-beige"
                      : "text-beige/90 hover:text-beige")
                  }
                >
                  {link.label}
                </Link>
              ))}
              <MoreMenu items={lgOverflow} orgSlug={activeOrg.slug} />
            </div>

            {/* xl: show all */}
            <div className="hidden 2xl:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={buildOrgUrl(activeOrg.slug, link.href)}
                  className={
                    "text-sm font-medium whitespace-nowrap transition-colors " +
                    (isActiveLink(link.href)
                      ? "text-orange"
                      : "text-beige hover:text-beige")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right: Auth + Burger */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block w-30">
              {isLoggedIn ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg border-2 text-beige cursor-pointer px-4 py-2 text-sm font-semibold border-orange/60 hover:bg-orange"
                >
                  Logga ut
                </button>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="rounded-lg border-2 text-beige cursor-pointer px-4 py-2 text-sm font-semibold border-orange/60 hover:bg-orange"
                >
                  Logga in
                </button>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="rounded-lg p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10 md:hidden"
              aria-label="Öppna meny"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              {!navOpen ? (
                <>
                  <span className="block w-6 h-0.5 bg-current mb-1"></span>
                  <span className="block w-6 h-0.5 bg-current mb-1"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                </>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu (simple, no height animation, no mobile org-indicator) */}
        {navOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="p-4">
              {/* Org switch (mobile) */}
              <div
                className="relative flex items-center gap-2 rounded-md border bg-white/20 p-2 border-white/10"
                ref={mobileOrgWrapRef}
              >
                {/* moving indicator (mobile) */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 rounded-md bg-orange/90 transition-all duration-300"
                  style={{
                    transform: `translateX(${mobileIndicator.left}px)`,
                    width: `${mobileIndicator.width}px`,
                  }}
                />
                {ORGS.map((o, i) => (
                  <button
                    key={o.slug}
                    type="button"
                    ref={(el) => {
                      mobileOrgButtonRefs.current[i] = el;
                    }}
                    onClick={() => setOrg(o.slug)}
                    aria-pressed={org === o.slug}
                    className={
                      "relative z-10 w-1/2 rounded px-3 py-1 text-sm font-medium transition-colors " +
                      (org === o.slug ? "text-white" : "text-white/90")
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <nav
              className="flex flex-col space-y-1 px-4 py-3 text-beige"
              aria-label="Mobil navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={buildOrgUrl(activeOrg.slug, link.href)}
                  onClick={() => setNavOpen(false)}
                  className={`block rounded px-3 py-2 font-medium transition-colors whitespace-nowrap ${
                    isActiveLink(link.href) ? "bg-beige/10" : "hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setNavOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full rounded-lg border-2 px-4 py-2 text-sm font-semibold border-orange/60"
                  >
                    Logga ut
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setNavOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full rounded-lg border px-4 py-2 text-sm font-semibold border-orange/60"
                  >
                    Logga in
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSubmit={() => setLoginModalOpen(false)}
      />
    </>
  );
}
