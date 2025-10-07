import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  metadataBase: new URL("https://allmskog-ac.nu"),
  title: "Sorsele Övre Allmänningsskog & Tärna-Stensele Allmänningsskog",
  description:
    "Information om jakt, fiske och verksamhet i Sorsele Övre Allmänningsskog och Tärna-Stensele Allmänningsskog.",
  keywords: [
    "Sorsele Övre Allmänning",
    "Sorsele Övre Allmänningsskog",
    "Tärna Stensele Allmänning",
    "Tärna-Stensele Allmänningsskog",
    "jakt",
    "fiske",
    "skog",
    "Vindelälven",
    "Västerbotten",
  ],
  icons: {
    icon: "/faviconGPT.png",
    apple: "/faviconGPT.png",
  },
  openGraph: {
    title: "Sorsele Övre & Tärna-Stensele Allmänningsskog",
    description:
      "Utforska jakt- och fiskemöjligheter samt nyheter från Sorsele Övre & Tärna-Stensele Allmänningsskog.",
    url: "https://allmskog-ac.nu",
    siteName: "Sorsele Övre & Tärna-Stensele Allmänningsskog",
    images: [
      {
        url: "/faviconGPT.png",
        width: 1200,
        height: 630,
        alt: "Sorsele Övre Allmänningsskog",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="scroll-smooth w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`min-h-screen w-full flex flex-col ${inter.variable}`}>
        <SessionProviderWrapper>
          {/* SessionProvider wraps the entire app to provide session context */}
          <Header />
          <main className="flex-1 flex flex-col w-full mx-auto">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
