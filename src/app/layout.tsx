import Header from "@/components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sorsele Övre Allmänningsskog</title>
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
