"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserSession } from "@/hooks/useUserSession";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import LoginModal from "./LoginModal";

const organizations = [
  { label: "Sorsele", slug: "sorsele" },
  { label: "Tärna-Stensele", slug: "tarna-stensele" },
];

const orgNavLinks = [
  { href: "/nyheter", label: "Nyheter" },
  { href: "/jakt-fiske", label: "Jakt & Fiske" },
  { href: "/dokument", label: "Dokument" },
  { href: "/natur-miljo", label: "Natur & Miljö" },
  { href: "/skogsbruk", label: "Skogsbruk" },
  { href: "/styrelse-medlemmar", label: "Styrelse & Medlemmar" },
  { href: "/kontakt", label: "Kontakt" },
];

interface orgTabLink {
  label: string;
}

export default function Header() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeOrg, setActiveOrg] = useState<string | null>(null);
  const [opendropDown, setOpendropDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropDown, setOpenMobileDropDown] = useState(false);
  const [activeTabSorsele, setActiveTabSorsele] = useState<orgTabLink>();
  const [activeTabStensele, setActiveTabStensele] = useState<orgTabLink>();
  const { isLoggedIn, user } = useUserSession();
  const pathname = usePathname();

  const closeModal = () => setLoginModalOpen(false);
  const onSubmitLogin = () => setLoginModalOpen(false);
  const handleLogOut = () => signOut({ callbackUrl: "/" });

  const onOrganisationClick = (orgSlug: string) => {
    console.log("Clicked org:", orgSlug);
    setActiveOrg(orgSlug);
    setOpendropDown(true);
  };
  const onOrganisationClickMobile = (orgSlug: string) => {
    setActiveOrg(orgSlug);
    setOpenMobileDropDown(true);
  };

  const handleActiveTabForOrg = (tab: string) => {
    if (activeOrg == "sorsele") {
      setActiveTabSorsele({
        label: tab,
      });
    }
    if (activeOrg == "tarna-stensele") {
      setActiveTabStensele({
        label: tab,
      });
    }
    setOpendropDown(false);
  };

  const handleHamburgerClick = () => {
    setMobileMenuOpen((open) => !open);
    setOpenMobileDropDown(false);
  };
  const buildOrgUrl = (orgSlug: string, href: string) => `/${orgSlug}${href}`;

  useEffect(() => {
    setActiveOrg(pathname.split("/")[1] || null);
  }, [pathname]);

  return (
    <>
      <header className="w-full bg-[#2F5D50] h-16 flex items-center px-4 md:px-8 shadow relative z-50">
        {/* Logo */}
        <div className="text-3xl text-orange font-bold flex-shrink-0 cursor-pointer">
          <a href="/">SÖA</a>
        </div>
        <nav className="hidden lg:flex flex-1 justify-center gap-8 xl:gap-20">
          {organizations.map((org) => (
            <button
              key={org.slug}
              onClick={() => onOrganisationClick(org.slug)}
              className={`text-xl xl:text-3xl  font-semibold px-2 py-1 transition-colors duration-200 hover:text-orange cursor-pointer ${
                activeOrg === org.slug
                  ? "text-orange border-b-2 border-orange"
                  : "text-beige"
              }`}
            >
              {org.label}
            </button>
          ))}
        </nav>

        {/* Auth Button */}
        <div className="hidden lg:flex items-center">
          {isLoggedIn && user ? (
            <button
              onClick={handleLogOut}
              className="bg-rose-800 text-beige px-4 py-2 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
            >
              Logga ut
            </button>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-orange/90 text-beige px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-orange transition-colors"
            >
              Logga in
            </button>
          )}
        </div>

        {/* Hamburger (Mobile only) */}
        <button
          className="lg:hidden p-2 ml-auto"
          aria-label="Open menu"
          onClick={() => handleHamburgerClick()}
        >
          <span className="block w-6 h-0.5 bg-current mb-1"></span>
          <span className="block w-6 h-0.5 bg-current mb-1"></span>
          <span className="block w-6 h-0.5 bg-current"></span>
        </button>
      </header>
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#2F5D50] shadow-inner">
          <div className="flex flex-col items-center gap-4 py-4">
            {organizations.map((org) => (
              <button
                key={org.slug}
                onClick={() => {
                  onOrganisationClickMobile(org.slug);
                }}
                className={`text-xl font-semibold px-2 py-1 transition-colors duration-200 hover:text-orange cursor-pointer ${
                  activeOrg === org.slug
                    ? "text-orange border-b-2 border-orange"
                    : "text-beige"
                }`}
              >
                {org.label}
              </button>
            ))}
            {/* Add auth buttons here if you want */}
          </div>
        </div>
      )}
      {/* Mobile Dropdown */}
      {openMobileDropDown && (
        <div className="lg:hidden w-full bg-[#2F5D50] shadow-inner">
          <div className="flex flex-col items-center gap-4 py-4">
            {orgNavLinks.map((link) => (
              <Link
                key={link.href}
                href={buildOrgUrl(activeOrg || "", link.href)}
                onClick={() => {
                  handleActiveTabForOrg(link.label);
                  setOpenMobileDropDown(false);
                }}
                className={`text-lg font-medium text-beige hover:text-orange transition-colors ${
                  (link.label === activeTabSorsele?.label &&
                    activeOrg === "sorsele") ||
                  (link.label === activeTabStensele?.label &&
                    activeOrg === "tarna-stensele")
                    ? "underline text-orange"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Org Submenu with transition */}
      {opendropDown && (
        <div
          className={`w-full bg-[#2F5D50] shadow-inner overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            activeOrg ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex justify-center gap-12 py-3">
            {activeOrg &&
              orgNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={buildOrgUrl(activeOrg, link.href)}
                  onClick={() => handleActiveTabForOrg(link.label)}
                  className={`text-beige text-lg font-medium hover:text-orange transition-colors ${
                    (link.label === activeTabSorsele?.label &&
                      activeOrg === "sorsele") ||
                    (link.label === activeTabStensele?.label &&
                      activeOrg === "tarna-stensele")
                      ? "underline text-orange"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={closeModal}
        onSubmit={onSubmitLogin}
      />
    </>
  );
}
