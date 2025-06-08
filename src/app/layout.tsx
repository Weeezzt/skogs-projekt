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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <SessionProviderWrapper>
          {/* SessionProvider wraps the entire app to provide session context */}
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
